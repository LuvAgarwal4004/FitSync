"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { images } from "@/components/util";
import SmartLink from "@/components/SmartLink";

export default function MarketPage() {
    const [index, setIndex] = useState(0);
    const timeoutRef = useRef(null);
    const touchStart = useRef(0);
    const [trends, setTrends] = useState([]);
    const [collectionData, setCollectionData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const resTrends = await fetch("/api/products?category=trends");
            const trendsData = await resTrends.json();
            const resDiscounts =
                await fetch("/api/products/discounts");

            const discounts =
                await resDiscounts.json();
            const merged = [
                ...discounts,
                ...trendsData.filter(
                    p =>
                        !discounts.some(
                            d => d._id === p._id
                        )
                )
            ];

            setTrends(merged);

            const resCollections = await fetch("/api/products?category=collections");
            const collectionsData = await resCollections.json();


            setCollectionData(collectionsData);
        };

        fetchData();
    }, []);

    const collection = useMemo(() => {
        return Object.values(
            collectionData
                .filter((product) => product.collectionId)
                .reduce((acc, product) => {
                    if (!acc[product.collectionId]) {
                        acc[product.collectionId] = {
                            id: product.collectionId,
                            title: product.collection,
                            images: [],
                        };
                    }

                    acc[product.collectionId].images.push(product);
                    return acc;
                }, {})
        );
    }, [collectionData]);

    const next = () =>
        setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    const prev = () =>
        setIndex((i) => (i === 0 ? images.length - 1 : i - 1));

    useEffect(() => {
        timeoutRef.current = setTimeout(next, 3000);
        return () => clearTimeout(timeoutRef.current);
    }, [index]);

    const onTouchStart = (e) => (touchStart.current = e.touches[0].clientX);
    const onTouchEnd = (e) => {
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (diff > 50) next();
        if (diff < -50) prev();
    };
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            align: "start",
            loop: true,
            slidesToScroll: 1,
        },
        [Autoplay({ delay: 3000, stopOnInteraction: false })]
    )

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState([])
    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return

        setScrollSnaps(emblaApi.scrollSnapList())
        emblaApi.on("select", onSelect)
        onSelect()
    }, [emblaApi, onSelect])


    return (
        <>
            <div
                className="relative w-full h-[220px]
sm:h-[320px]
md:h-[420px]
lg:h-[520px] overflow-hidden rounded-lg bg-[#4169e1] shadow shadow-2xl shadow-blue-500"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {images.map((src, i) => (
                    <div
                        key={src}
                        className={`absolute inset-0 transition-opacity duration-700 ${i === index ?
                            "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Image
                            src={src}
                            alt=""
                            fill
                            priority={i === 0}
                            quality={75}
                            sizes="(max-width: 768px) 100vw, 1200px"
                            className="object-cover"
                        />
                    </div>
                ))}

                {/* arrows */}
                <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/60 p-2 rounded-full"
                >
                    ❮
                </button>
                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/60 p-2 rounded-full"
                >
                    ❯
                </button>

                {/* dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>
            <div className=" flex flex-col items-center justify-center"  >
                <div className="text-3xl
md:text-5xl font-bold mt-7 m-3">Categories We Offer</div>
                <div className="text-base
md:text-xl mb-4">Browse items by category</div>
            </div>
            <div className=" relative w-full max-w-6xl mx-auto">
                {/* Carousel */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex flex-nowrap">
                        {collection.length > 0 && collection.map((card) => (
                            <SmartLink key={card.id || card.title} href={`/collections/${card.id}`}
                                className="basis-[80%]
sm:basis-[48%]
md:basis-1/3
lg:basis-1/4 flex-none p-3">
                                <div


                                >
                                    <div className="bg-white rounded-xl shadow-md overflow-hidden
                      hover:shadow-lg hover:shadow-[#1e90ff]
                      hover:-translate-y-1 hover:scale-[1.02]
                       transition-all duration-300">

                                        {/* Image */}
                                        <div className="relative w-full h-48">
                                            <Image
                                                src={card.images[0].image}
                                                alt={card.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Text */}
                                        <div className="p-3
md:p-4">
                                            <h3 className="text-sm
sm:text-lg font-semibold">{card.title}</h3>
                                            <p className="text-sm text-gray-500 mt-2">
                                                This is a short description for {card.title}.
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </SmartLink>
                        ))}
                    </div>
                </div>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2  flex justify-center mt-6 gap-3">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi?.scrollTo(index)}
                            className={`h-1.5 w-1.5 rounded-full transition-all ${index === selectedIndex
                                ? "bg-black scale-200"
                                : "bg-gray-500"
                                }`}
                        />
                    ))}
                </div>
            </div>
            <div className=" flex flex-col items-center justify-center"  >
                <div className="text-3xl
md:text-5xl font-bold mt-7 m-3">New Arrivals</div>
                <div className="text-base
md:text-xl mb-4">Look at the latest collection that we offer</div>
            </div>
            <div className="w-full max-w-6xl mx-auto px-4">
                <div className="
       grid
       grid-cols-2
       md:grid-cols-3
       lg:grid-cols-4
       gap-3
sm:gap-5
lg:gap-6
        ">
                    {trends.length > 0 && trends.map((trend) => (

                        <SmartLink key={trend._id} href={`/ProductDetail/${trend._id}`}>
                            <div
                                key={trend._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:shadow-[#00bfff] transition-shadow duration-300"
                            >
                                <div className="relative w-full h-44
sm:h-60
md:h-72
lg:h-80">
                                    {trend.isDiscount && (
                                        <div
                                            className="
      absolute
      top-3
      left-3
      z-10
      bg-gradient-to-r
      from-red-500
      to-pink-500
      text-white
      font-bold
      px-4
      py-2
      rounded-full
      shadow-xl
      animate-pulse
    "
                                        >
                                            -{Number(trend.discountPercent || 0)}% OFF
                                        </div>
                                    )}
                                    <Image src={trend.image} alt="" fill className="object-cover" />
                                </div>

                                <div className="p-3
md:p-4">
                                    <h3 className="text-sm
sm:text-lg font-semibold">{trend.title}</h3>
                                    <div className="mt-2">

                                        {trend.isDiscount ? (
                                            <>
                                                <p className="text-gray-400 line-through">
                                                    ₹{trend.price}
                                                </p>

                                                <p className="text-green-600 font-bold text-base
md:text-xl">
                                                    ₹{trend.discountedPrice}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-2">
                                                ₹{trend.price}
                                            </p>
                                        )}

                                    </div>

                                    {/* <p className="text-xl text-gray-500 mt-2">Add to Wishlist</p> */}
                                </div>
                            </div>
                        </SmartLink>
                    ))}
                </div>
            </div>
        </>

    );
}