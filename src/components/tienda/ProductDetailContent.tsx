'use client'

import React, { useState } from 'react'
import { getVariantPrice, getFramePrice, getFrameImage, type Product } from '@/data/products'
import { useCart } from '@/context/CartContext'
import Breadcrumb from './Breadcrumb'
import ProductGallery from './ProductGallery'
import ProductInfo from './ProductInfo'
import AddedToast from './AddedToast'
import RelatedProducts from './RelatedProducts'

// Client island del detalle de producto: galería, selección de variante/marco y
// add-to-cart. La page server provee `product` y `products` (relacionados) ya
// cargados (ISR) y renderiza el SEO (metadata + JSON-LD Product).
interface ProductDetailContentProps {
  product: Product
  products: Product[]
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ product, products }) => {
  const [toastVisible, setToastVisible] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [frameSelected, setFrameSelected] = useState(false)
  const [selectedFrameColor, setSelectedFrameColor] = useState<string | null>(null)
  const { addItem } = useCart()

  // Inicializar selectedSize con la primera variante si aún no se estableció
  const effectiveSize = selectedSize ?? (product.variants?.[0]?.label ?? null)

  const frameImage = frameSelected
    ? getFrameImage(product, effectiveSize, selectedFrameColor)
    : null

  const handleAddToCart = () => {
    const unitPrice =
      getVariantPrice(product, effectiveSize) +
      (frameSelected ? getFramePrice(product, effectiveSize) : 0)
    addItem({
      slug: product.slug,
      title: product.title,
      catLabel: product.catLabel,
      image: product.images[0] ?? '',
      selectedSize: effectiveSize,
      hasFrame: frameSelected,
      frameColor: selectedFrameColor,
      unitPrice,
    })
    setToastVisible(true)
  }

  return (
    <>
      <main className="min-h-screen bg-cream-50">
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 items-start">
            <div className="md:sticky md:top-[100px]">
              <div className="pb-4">
                <Breadcrumb
                  items={[
                    { label: 'tienda', href: '/tienda' },
                    { label: product.catLabel, href: `/tienda?cat=${product.category}` },
                    { label: product.title },
                  ]}
                />
              </div>
              <div className="md:h-[min(580px,calc(100dvh-140px))]">
                <ProductGallery product={product} sticky frameImage={frameImage} />
              </div>
            </div>
            <ProductInfo
              product={product}
              onAddToCart={handleAddToCart}
              selectedSize={effectiveSize}
              onSizeChange={setSelectedSize}
              frameSelected={frameSelected}
              onFrameToggle={() => setFrameSelected((p) => !p)}
              selectedFrameColor={selectedFrameColor}
              onFrameColorChange={(color) => setSelectedFrameColor(color)}
            />
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
          <RelatedProducts currentSlug={product.slug} category={product.category} products={products} />
        </div>
      </main>

      <AddedToast
        visible={toastVisible}
        productTitle={product.title}
        onDismiss={() => setToastVisible(false)}
      />
    </>
  )
}

export default ProductDetailContent
