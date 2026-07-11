import { useEffect, useState } from "react";
import styles from "../SliderShow/SliderShow.module.scss";

import barber1 from "../../assets/images/banner.png";
import barber2 from "../../assets/images/banner2.jpg";
import barber3 from "../../assets/images/banner3.webp";


const images = [
  barber1,
  barber2,
  barber3,

];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.slider}>
      <img
        src={images[current]}
        alt="Barber"
        className={styles.image}
      />
    </div>
  );
}