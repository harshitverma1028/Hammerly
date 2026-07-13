import Hero from "../../components/home/Hero";
import FeaturedCategories from "../../components/home/FeaturedCategories";
import FeaturedAuctions from "../../components/home/FeaturedAuctions";
import HowItWorks from "../../components/home/HowItWorks";
import Testimonials from "../../components/home/Testimonials";
import Newsletter from "../../components/home/Newsletter";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <FeaturedAuctions />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
