/**
 * Crea todas las colecciones de NatArt en PocketBase.
 * Uso: node scripts/create-collections.mjs
 */
import PocketBase from 'pocketbase'

const PB_URL        = 'https://nat.lhstudio.com.ar'
const ADMIN_EMAIL   = process.env.PB_EMAIL    ?? 'poneTuEmail@aqui.com'
const ADMIN_PASSWORD = process.env.PB_PASSWORD ?? 'poneTuPassword'

const pb = new PocketBase(PB_URL)

async function create(data) {
  try {
    await pb.collections.create(data)
    console.log(`✓ ${data.name}`)
  } catch (e) {
    if (e.status === 400 && e.response?.data?.name) {
      console.log(`⚠ ${data.name} ya existe — saltando`)
    } else {
      console.error(`✗ ${data.name}:`, e.message)
    }
  }
}

async function main() {
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
  console.log('✓ Admin autenticado\n')

  // ── shipping_zones ──────────────────────────────────────────────────────────
  await create({
    name: 'shipping_zones',
    type: 'base',
    fields: [
      { name: 'name',         type: 'text',   required: true  },
      { name: 'price',        type: 'number', required: true  },
      { name: 'active',       type: 'bool'                    },
      { name: 'postal_codes', type: 'json'                    },
    ],
  })

  // ── shipping_config ─────────────────────────────────────────────────────────
  await create({
    name: 'shipping_config',
    type: 'base',
    fields: [
      { name: 'price',       type: 'number', required: true },
      { name: 'label',       type: 'text',   required: true },
      { name: 'description', type: 'text'                   },
    ],
  })

  // ── products ────────────────────────────────────────────────────────────────
  await create({
    name: 'products',
    type: 'base',
    fields: [
      { name: 'slug',        type: 'text',   required: true  },
      { name: 'title',       type: 'text',   required: true  },
      { name: 'category',    type: 'text',   required: true  },
      { name: 'cat_label',   type: 'text'                    },
      { name: 'base_price',  type: 'number', required: true  },
      { name: 'size',        type: 'text'                    },
      { name: 'tone',        type: 'text'                    },
      { name: 'tall',        type: 'number'                  },
      { name: 'medium',      type: 'text'                    },
      { name: 'edition',     type: 'text'                    },
      { name: 'description', type: 'text'                    },
      { name: 'images',      type: 'json'                    },
      { name: 'tags',        type: 'json'                    },
      { name: 'variants',    type: 'json'                    },
      { name: 'has_frame',   type: 'bool'                    },
      { name: 'frame_price', type: 'number'                  },
      { name: 'on_demand',   type: 'bool'                    },
      { name: 'sort_order',  type: 'number'                  },
    ],
  })

  // ── product_stock ───────────────────────────────────────────────────────────
  await create({
    name: 'product_stock',
    type: 'base',
    fields: [
      { name: 'slug',   type: 'text',   required: true },
      { name: 'stock',  type: 'number'                 },
      { name: 'status', type: 'text',   required: true },
    ],
  })

  // ── blog_posts ──────────────────────────────────────────────────────────────
  await create({
    name: 'blog_posts',
    type: 'base',
    fields: [
      { name: 'slug',         type: 'text',   required: true  },
      { name: 'title',        type: 'text',   required: true  },
      { name: 'subtitle',     type: 'text'                    },
      { name: 'category',     type: 'text',   required: true  },
      { name: 'date',         type: 'date',   required: true  },
      { name: 'reading_time', type: 'text'                    },
      { name: 'cover_image',  type: 'text'                    },
      { name: 'related',      type: 'json'                    },
      { name: 'published',    type: 'bool'                    },
      { name: 'body',         type: 'json'                    },
    ],
  })

  // ── orders ──────────────────────────────────────────────────────────────────
  await create({
    name: 'orders',
    type: 'base',
    fields: [
      { name: 'status',          type: 'text',   required: true },
      { name: 'customer_name',   type: 'text',   required: true },
      { name: 'customer_email',  type: 'text',   required: true },
      { name: 'customer_phone',  type: 'text'                   },
      { name: 'delivery_mode',   type: 'text'                   },
      { name: 'street',          type: 'text'                   },
      { name: 'city',            type: 'text'                   },
      { name: 'postal_code',     type: 'text'                   },
      { name: 'payment_method',  type: 'text'                   },
      { name: 'shipping_cost',   type: 'number'                 },
      { name: 'tracking_number', type: 'text'                   },
      { name: 'mp_payment_id',   type: 'text'                   },
      { name: 'total',           type: 'number', required: true },
      { name: 'items',           type: 'json'                   },
    ],
  })

  console.log('\n✓ Colecciones creadas. Revisalas en https://nat.lhstudio.com.ar/_/')
}

main().catch(console.error)
