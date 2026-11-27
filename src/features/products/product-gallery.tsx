"use client";

import {
  useMemo,
  useState,
} from "react";
import Image from "next/image";

import type { Product } from "@/types/product";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({
  product,
}: ProductGalleryProps) {
  const images = useMemo(
    () =>
      product.images.length > 0
        ? product.images
        : [product.thumbnail],
    [
      product.images,
      product.thumbnail,
    ],
  );

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(images[0]);

  return (
    <section
      aria-label={`${product.title} image gallery`}
      className="space-y-4"
    >
      <div className="group relative aspect-square overflow-hidden rounded-3xl border bg-muted/30">
        <Image
          src={selectedImage}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map(
            (image, index) => {
              const selected =
                image ===
                selectedImage;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setSelectedImage(
                      image,
                    )
                  }
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={
                    selected
                  }
                  className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                    selected
                      ? "ring-2 ring-foreground"
                      : "hover:border-foreground/50"
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-contain p-2"
                  />
                </button>
              );
            },
          )}
        </div>
      ) : null}
    </section>
  );
}
