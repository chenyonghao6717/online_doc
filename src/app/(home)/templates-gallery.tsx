"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { templates } from "@/constants/templates";
import { useRouter } from "next/navigation";
import { createDocument } from "@/lib/api/document";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import FullScreenSpinner from "@/components/spinners/full-screen-spinner";

export const TemplatesGallery = () => {
  const router = useRouter();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      toast.success("Created successfully!");
    },
    onError: () => {
      toast.error("Created failed!");
    },
  });

  const onTemplateClick = async (title: string, initContent: string) => {
    const res = await mutateAsync({
      title: title,
      initContent: initContent,
    });
    router.push(`/documents/${res.id}`);
  };

  return (
    <div className="bg-[#F1F3F4] ">
      <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
        <h3 className="font-medium">Start a New Document</h3>
        <Carousel>
          <CarouselContent className="-ml-4">
            {templates.map((template) => {
              return (
                <CarouselItem
                  key={template.id}
                  className="
                    basis-1/2 sm:basis-1/3 md:basis-1/4
                    lg:basis-1/5 xl:basis-1/6
                    2xl:basis-[14.285714%] pl-4"
                >
                  <div
                    className={cn(
                      "aspect-[3/4] flex flex-col gap-y-2.5",
                      isPending && "pointer-events-none opacity-50"
                    )}
                  >
                    <button
                      disabled={isPending}
                      onClick={() => onTemplateClick(template.id, "")}
                      style={{
                        backgroundImage: `url(${template.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                      className="
                        size-full hover:border-blue-500 rounded-sm
                        border hover:bg-blue-50 transition
                        flex flex-col items-center justify-center gap-y-4 bg-white
                      "
                    />
                    <p className="text-sm font-medium truncate w-full text-center">
                      {template.label}
                    </p>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};
