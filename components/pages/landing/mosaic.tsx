"use client";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

const poppins = Poppins({ subsets: ['latin'], weight: ["400", "500", "600", "700"] });

const Mosaic = () => {
  const { t } = useTranslation('landing');

  const images = [
    { url: "/Rectangle 36.png", alt: "Image 1" },
    { url: "/Rectangle 38.png", alt: "Image 2" },
    { url: "/Rectangle 37.png", alt: "Image 3" },
    { url: "/Rectangle 39.png", alt: "Image 4" },
    { url: "/Rectangle 40.png", alt: "Image 5" },
    { url: "/Rectangle 43.png", alt: "Image 6" },
    { url: "/Rectangle 45.png", alt: "Image 7" },
    { url: "/Rectangle 41.png", alt: "Image 8" },
    { url: "/Rectangle 44.png", alt: "Image 9" },
  ];

  return (
    <div className={cn(poppins.className, "w-full overflow-hidden p-8 bg-white")}>
      <div className="flex flex-col gap-3 items-center justify-center mb-[-16px]">
        <h2 className="text-[16px] font-semibold text-gray-600">
          {t('mosaic.title')}
        </h2>
        <motion.h2
          animate={{ 
            color: ["#21807D", "#87C7C3", "#21807D"] 
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-[32px] font-bold"
        >
          {t('mosaic.hashtag')}
        </motion.h2>
      </div>
      <div className="flex gap-4 justify-center ">
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-4 self-end">
            <div className="bg-primary-100 h-[306px] w-[219px]">
              <Image src={images[0].url} alt={images[0].alt} width={219} height={306} />
            </div>
            <div className="bg-primary-200 h-[250px] w-[361px] self-end">
              <Image src={images[1].url} alt={images[1].alt} width={361} height={250} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-primary-100 h-[258px] w-[305px]">
              <Image src={images[2].url} alt={images[2].alt} width={305} height={258} />
            </div>
            <div className="bg-primary-200 h-[194px] w-[275px]">
              <Image src={images[3].url} alt={images[3].alt} width={275} height={194} />
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="h-[314px] w-[236px] bg-primary-200">
            <Image src={images[4].url} alt={images[4].alt} width={236} height={314} />
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-4">
            <div className="bg-primary-100 h-[278px] w-[232px] self-end">
              <Image src={images[5].url} alt={images[5].alt} width={232} height={278} />
            </div>
            <div className="bg-primary-200 h-[346px] w-[340px]">
              <Image src={images[6].url} alt={images[6].alt} width={340} height={346} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-primary-100 h-[194px] w-[142px]">
              <Image src={images[7].url} alt={images[7].alt} width={142} height={194} />
            </div>
            <div className="bg-primary-200 h-[157px] w-[206px]">
              <Image src={images[8].url} alt={images[8].alt} width={206} height={157} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mosaic;
