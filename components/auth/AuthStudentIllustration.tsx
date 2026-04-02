import Image from "next/image";

type AuthStudentIllustrationProps = {
  alt?: string;
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
};

export default function AuthStudentIllustration({
  alt = "Student using Smart Expense",
  imageSrc = "/student2.png",
  imageWidth = 1040,
  imageHeight = 1120,
}: AuthStudentIllustrationProps) {
  return (
    <section className="relative hidden w-full items-start justify-center self-stretch pointer-events-none lg:flex">
      <div className="relative flex min-h-[620px] w-full max-w-[680px] items-start justify-center pt-6 xl:min-h-[680px]">
        <div className="absolute left-1/2 top-0 bottom-[-96px] flex w-[62%] -translate-x-1/2 flex-col items-center">
          <div className="h-[220px] w-full rounded-t-[260px] bg-[#e5e5e5]" />
          <div className="w-full flex-1 bg-[#e5e5e5]" />
        </div>
        <Image
          src={imageSrc}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          className="relative z-10 mt-20 h-auto w-full max-w-[640px] object-contain"
          priority
        />
      </div>
    </section>
  );
}
