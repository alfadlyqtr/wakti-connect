
import Image from "next/image";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { GradientGenerator } from "@/components/ui/gradient-generator";

export default function Gradients() {
  return (
    <div className="relative">
      <div className="my-40">
        <div>
          <Image
            src="https://res.cloudinary.com/deelfmnhg/image/upload/v1737474221/grad_mscerb.png"
            alt="Gradient Background"
            height={700}
            width={700}
            className="absolute -top-28 -z-10 min-h-screen w-full object-cover"
          />
          <p className="px-6 text-center text-lg font-light uppercase tracking-widest text-white lg:text-xl">
            Introducing
          </p>

          <h1 className="text-center text-7xl tracking-tighter text-white sm:text-9xl">
            Graaadients
          </h1>
          <p className="mx-auto max-w-lg px-6 text-center text-sm font-light text-white lg:-mt-4 lg:text-lg">
            +5000 abstract gradient elements and backgrounds for your amazing
            design projects.
          </p>
        </div>
        
        <div className="mt-10 flex justify-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-slate-200 hover:text-white">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-200" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products" className="text-slate-200 hover:text-white">
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-200" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">Graaadients</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <GradientGenerator />

        <p className="ml-2 mt-6 text-center font-semibold">
          All gradients are 100% free.
        </p>
      </div>
    </div>
  );
}
