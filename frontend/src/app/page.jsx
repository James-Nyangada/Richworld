import Hero from "../components/home/Hero"
import BestSelling from "../components/home/BestSelling"
import BestDeals from "@/components/home/BestDeals"
import WhyBookWithUs from "@/components/home/WhyBookWithUs"
import Testimonials from "@/components/home/Testimonials"
import HowWeCanHelp from "@/components/home/HowWeCanHelp"

export default function HomePage() {
  return (
    <div>
      <Hero />
      <BestSelling />
      <BestDeals />
      <WhyBookWithUs/>
      <Testimonials/>
      <HowWeCanHelp/>
    </div>
  )
}
