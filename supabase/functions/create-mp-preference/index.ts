import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const body = await req.json();
    const { customer, delivery, items, shippingCost, total } = body;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { db: { schema: 'nat_ecommerce' } },
    );

    // 1. Create order in DB
    const { data: orderId, error: rpcError } = await supabase.rpc(
      'create_order',
      {
        p_customer_name: customer.name,
        p_customer_email: customer.email,
        p_customer_phone: customer.phone,
        p_delivery_mode: delivery.mode,
        p_street: delivery.street ?? '',
        p_city: delivery.city ?? '',
        p_postal_code: delivery.postalCode ?? '',
        p_payment_method: 'mercadopago',
        p_shipping_cost: shippingCost,
        p_total: total,
        p_items: items,
      },
    );

    if (rpcError) {
      const status = rpcError.message.includes('sin-stock') ? 409 : 500;
      return new Response(JSON.stringify({ error: rpcError.message }), {
        status,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // 2. Build MP preference
    const siteUrl = Deno.env.get('SITE_URL')!;
    const accessToken = Deno.env.get('MP_ACCESS_TOKEN')!;
    const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const preference = {
      items: items.map(
        (i: {
          title: string;
          unit_price: number;
          qty: number;
          slug: string;
        }) => ({
          id: i.slug,
          title: i.title,
          quantity: i.qty,
          unit_price: i.unit_price,
          currency_id: 'ARS',
        }),
      ),
      payer: {
        name: customer.name,
        email: customer.email,
        phone: { number: customer.phone },
      },
      back_urls: {
        success: `${siteUrl}/checkout/confirmacion?order=${orderId}`,
        failure: `${siteUrl}/checkout/error?order=${orderId}`,
        pending: `${siteUrl}/checkout/confirmacion?order=${orderId}&pending=true`,
      },
      auto_return: siteUrl.includes('localhost') ? undefined : 'approved',
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mp-webhook`,
      external_reference: orderId,
      expires: true,
      expiration_date_to: expiry,
      statement_descriptor: 'NATALIA HELLER ARTE',
    } as {
      items: Array<{
        id: string;
        title: string;
        quantity: number;
        unit_price: number;
        currency_id: string;
      }>;
      payer: { name: string; email: string; phone: { number: string } };
      back_urls: { success: string; failure: string; pending: string };
      auto_return: string;
      notification_url: string;
      external_reference: string;
      expires: boolean;
      expiration_date_to: string;
      statement_descriptor: string;
    };

    if (shippingCost > 0) {
      preference.items.push({
        id: 'envio',
        title: 'Costo de envío',
        quantity: 1,
        unit_price: shippingCost,
        currency_id: 'ARS',
      });
    }
    const mpRes = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preference),
      },
    );

    if (!mpRes.ok) {
      const mpErr = await mpRes.text();
      console.error('MP error:', mpErr);
      return new Response(JSON.stringify({ error: 'mp_error' }), {
        status: 502,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const mpData = await mpRes.json();

    // 3. Save preference ID back to the order
    await supabase
      .from('orders')
      .update({ mp_preference_id: mpData.id })
      .eq('id', orderId);

    return new Response(
      JSON.stringify({ orderId, initPoint: mpData.init_point }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'internal' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
