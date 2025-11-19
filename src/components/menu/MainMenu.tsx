import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { DrawTextSVG } from "../icons/SvgNames";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
export default function MainMenu() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const pageSize = 6;
  type MenuItem = { name: string; desc: string; price: string; image?: string };
  type MenuEntry = {
    mainImage: string;
    name: string;
    namePath: string;
    menuItems: MenuItem[];
    images?: string[];
  };

  const [focusedItem, setFocusedItem] = useState<MenuItem | null>(null);
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
  const containerHeight = 4000;
  const padding = 36; // safe padding from edges

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const left = 0;
  const right = screenWidth;
  const centerX = screenWidth / 2;

  const getCurvedPath = (h: number) => `
    M${left} 0
    C${right * 0.25} ${h * 0.1},
     ${right * 0.75} ${h * 0.2},
     ${right} ${h * 0.3}
    S${left} ${h * 0.45},
     ${right} ${h * 0.6}
    S${left} ${h * 0.75},
     ${right} ${h * 0.9}
    S${centerX} ${h * 0.97},
     ${centerX} ${h}
  `;

  const menuData = [
    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },

    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },

    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
    {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
        {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
        {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
        {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
        {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
        {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },

        {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
        {
      mainImage:
        "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
      name: "Classic Burger",
      namePath: `M4.20 42.90Q0 42.90 0 39.60Q0 38.05 1.05 36.95Q2.10 35.80 3.55 35.80Q4.60 35.80 5.20 36.50Q5.65 37.10 5.65 37.80Q5.65 38.40 5.43 38.98Q5.20 39.55 4.65 39.95Q3.85 40.70 2.80 40.70Q1.90 40.70 1.30 40.10Q1.85 41.55 4.15 41.55Q4.75 41.55 5.25 41.40Q9.55 40.25 12.75 36.45Q15.50 33.10 19.95 24.35L27.40 9.70Q28.00 8.55 28.78 7.57Q29.55 6.60 30.40 5.80Q28.50 5.85 26.43 6.30Q24.35 6.75 22.10 7.50Q17.55 9.05 15 11.10Q10.10 14.95 10.10 18.25Q10.10 20.20 12.35 20.20Q15 20.20 17.90 18.50Q20.55 16.95 22.50 14.55Q22.65 14.40 22.80 14.40Q23.15 14.40 23.15 14.65Q23.15 16.60 18.35 19.15Q13.95 21.55 11.65 21.55Q7 21.55 7 18Q7 16.35 8.30 14.50Q9.85 12.30 12.45 10.52Q15.05 8.75 18.75 7.40Q25.15 5.05 31.25 5Q34.40 2.30 37.75 2.30Q39.15 2.30 40.40 2.85Q40.65 2.95 40.65 3.20Q40.65 3.95 40.25 3.70Q39.45 3.25 38.25 3.25Q35.85 3.25 33.65 5.05Q37.80 5.45 39.85 7.35Q41.55 9.05 41.55 11.25Q41.55 14.55 38.70 17.85Q35.95 21.05 31.90 22.45Q38.70 23.65 38.70 29.05Q38.70 33.55 34.05 37.70Q29.00 42.15 21.85 42.65Q21.50 42.70 21.13 42.70Q20.75 42.70 20.35 42.70Q13.80 42.70 13.85 38.75Q8.80 42.90 4.20 42.90M25.00 22.40Q26.00 22.30 26.98 22.22Q27.95 22.15 28.85 22.15Q32.60 21.50 35.40 18.30Q38.30 15 38.30 11.40Q38.30 9.45 37.15 8.05Q35.70 6.25 32.75 5.85Q31.80 6.80 31.08 8.02Q30.35 9.25 29.75 10.70L25.00 22.40M20.05 41.85Q21.05 41.85 22.25 41.60Q23.45 41.35 24.95 40.90Q29.30 39.50 32.20 36.05Q35.20 32.50 35.20 29.25Q35.20 26.70 33.30 25.20Q31.20 23.55 27.15 23.55Q25.90 23.55 24.45 23.70Q24.05 24.70 23.38 26.15Q22.70 27.60 21.70 29.40Q21.35 30 20.95 30.65Q20.55 31.30 20.05 32Q22.05 31 24.18 30.27Q26.30 29.55 28.60 29.05Q29.30 28.90 29.65 28.90Q30.20 28.90 30.20 29.10Q30.20 29.60 28.65 29.95Q22.00 31.70 18.55 35.30Q16.40 37.50 16.40 39.15Q16.40 40 16.95 40.70Q17.95 41.85 20.05 41.85ZM44.75 39.95Q41.55 39.95 41.55 36.95Q41.55 35.90 42.15 34.13Q42.75 32.35 43.85 29.90L46.60 23.85Q47.05 22.80 48.55 22.80L51.55 22.80Q49.80 24.10 48.35 27Q47.80 28.10 47.03 29.73Q46.25 31.35 45.25 33.45Q44.30 35.40 44.30 36.95Q44.30 38.55 45.40 38.55Q46.60 38.55 48.25 36.65Q51 33.45 55.65 23.85Q56.20 22.80 57.55 22.80L60.25 22.80Q58.60 24.15 56.80 27.75Q54.30 32.80 53.80 35.45Q53.75 35.75 53.73 36Q53.70 36.25 53.70 36.50Q53.70 38.45 55.05 38.45Q56.50 38.45 58.45 35.60L59.20 35.95Q56.50 39.95 53.85 39.95Q51.05 39.95 51.05 36.40Q51.05 35.05 51.55 33.55Q47.85 39.95 44.75 39.95ZM59.05 40.35Q60 37.95 61.57 34.35Q63.15 30.75 65.15 26.15Q65.55 25.15 65.92 24.55Q66.30 23.95 66.60 23.60Q67.25 22.85 68.35 23L69.40 23.15Q69.75 23.20 70.03 23.22Q70.30 23.25 70.50 23.20Q69.50 23.70 68.17 26.02Q66.85 28.35 65.25 32.35Q65.80 31.65 66.65 30.48Q67.50 29.30 68.80 27.75Q70.25 26.05 71.80 24.60Q73.35 23.15 74.80 23.15Q75.95 23.15 76.45 23.90Q76.95 24.65 76.95 25.60Q76.95 26.75 76.05 27.65Q75.15 28.55 74.30 28.55Q73.95 28.55 73.58 28.40Q73.20 28.25 73.20 27.95Q73.20 27.70 73.30 27.48Q73.40 27.25 73.40 26.95Q73.40 26.20 72.70 26.20Q72.45 26.20 72.03 26.32Q71.60 26.45 70.90 27.15Q69.50 28.45 67.88 30.27Q66.25 32.10 64.83 34.35Q63.40 36.60 62.50 39.30Q62.25 40.05 61 40.10Q59.30 40.20 59.05 40.35ZM73.75 53.05Q71.10 53.05 69.80 51.30Q69.25 50.45 69.25 49.05Q69.25 47.95 69.55 47.45L70.45 47.40Q70.20 48.30 70.20 48.95Q70.20 51.65 73.35 51.65Q76.25 51.65 79.25 47Q80.10 45.70 80.97 43.88Q81.85 42.05 82.65 39.75Q83.20 38.25 83.72 36.73Q84.25 35.20 84.80 33.65Q83 36.55 81.20 38.30Q79.35 40.05 77.80 40.05Q76.55 40.05 75.80 38.90Q75 37.80 75 35.85Q75 31.15 79.20 26.05Q79.90 25.20 80.80 24.50Q81.70 23.80 82.75 23.25Q84.90 22.15 86.90 22.15Q89.35 22.15 90.80 23.75Q91.15 24.10 91.15 24.55Q91.15 25.40 90.25 25.20Q89.75 23.40 87.95 23.40Q85.85 23.40 83 26.35Q80.90 28.55 79.35 31.10Q77.25 34.60 77.25 36.95Q77.25 38.65 78.50 38.65Q80 38.65 81.90 36.45Q83.95 34 86.35 29.45Q87.30 27.65 87.85 27Q88.65 26.20 89.75 26.25L90.80 26.40Q91.40 26.55 91.85 26.45Q91.50 26.80 91.15 27.20Q90.80 27.60 90.55 28Q90.10 28.70 89.55 29.77Q89 30.85 88.45 32.30Q87.85 33.85 87.33 35.30Q86.80 36.75 86.25 38.05Q85 41.25 83.95 43.60Q82.90 45.95 82.10 47.50Q81.55 48.60 80.72 49.50Q79.90 50.40 78.85 51.20Q76.40 53.05 73.75 53.05ZM96.45 40.20Q94.50 40.20 93.10 38.95Q92.35 38.25 92.03 37.33Q91.70 36.40 91.70 35.20Q91.70 30.60 95.50 26.05Q98.70 22.20 102.15 22.20Q103.30 22.20 104.10 22.80Q104.95 23.50 104.95 24.60Q104.95 27.35 101.30 30.10Q100.15 30.95 98.25 31.60Q96.15 32.30 95.20 32.30Q94.50 34 94.50 35.90Q94.50 39.15 96.90 39.15Q100.05 39.15 102.80 35.05L103 34.75L103.85 35.10L103.70 35.40Q102.45 37.90 100.55 39.05Q98.65 40.20 96.45 40.20M95.50 31.45Q96.35 31.45 97.85 30.90Q98.70 30.55 99.48 30.15Q100.25 29.75 100.85 29.25Q103.60 26.95 103.60 24.40Q103.60 23.30 102.80 23.30Q101.40 23.30 98.55 26.75Q97.10 28.50 95.50 31.45ZM103.95 40.35Q104.90 37.95 106.48 34.35Q108.05 30.75 110.05 26.15Q110.45 25.15 110.83 24.55Q111.20 23.95 111.50 23.60Q112.15 22.85 113.25 23L114.30 23.15Q114.65 23.20 114.93 23.22Q115.20 23.25 115.40 23.20Q114.40 23.70 113.08 26.02Q111.75 28.35 110.15 32.35Q110.70 31.65 111.55 30.48Q112.40 29.30 113.70 27.75Q115.15 26.05 116.70 24.60Q118.25 23.15 119.70 23.15Q120.85 23.15 121.35 23.90Q121.85 24.65 121.85 25.60Q121.85 26.75 120.95 27.65Q120.05 28.55 119.20 28.55Q118.85 28.55 118.48 28.40Q118.10 28.25 118.10 27.95Q118.10 27.70 118.20 27.48Q118.30 27.25 118.30 26.95Q118.30 26.20 117.60 26.20Q117.35 26.20 116.93 26.32Q116.50 26.45 115.80 27.15Q114.40 28.45 112.78 30.27Q111.15 32.10 109.73 34.35Q108.30 36.60 107.40 39.30Q107.15 40.05 105.90 40.10Q104.20 40.20 103.95 40.35Z`,

      menuItems: [
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Classic Burger",
          desc: "Beef, lettuce, cheese",
          price: "12€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
        {
          name: "Cheese Deluxe",
          desc: "Double cheese & bacon",
          price: "14€",
          image:
            "https://geniusbees.s3.eu-north-1.amazonaws.com/activity-template-images/interpret-bar-graphs/clip-art-christmas.png",
        },
      ],
    },
  ];

  // points array removed: using CSS grid (gridConfig) for layout
  const [gridConfig, setGridConfig] = useState<{
    cols: number;
    rows: number;
    cellSize: number;
    gap: number;
    containerWidth: number;
    containerHeight?: number;
  }>({ cols: 1, rows: 1, cellSize: 120, gap: 18, containerWidth: 0 });
  // selected item for popup modal
  const [selectedItem, setSelectedItem] = useState<
    (typeof menuData)[number] | null
  >(null);
  // popup-related state

  // helper clamp
  const clamp = (val: number, a: number, b: number) =>
    Math.max(a, Math.min(val, b));

  // Lock body scroll when popup is open and handle Escape to close
  useEffect(() => {
    if (typeof document === "undefined") return;
    const original = document.body.style.overflow;
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = original;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [selectedItem]);

  // whenever a new item is opened, reset the active thumbnail to first
  useEffect(() => {
    setPageIndex(0);
    setFocusedItem(null);
  }, [selectedItem]);

  // Generate grid-based points (replaces path-based random placement)
  useEffect(() => {
    const generateGridPoints = () => {
      const numPoints = menuData.length;
      const sw = (typeof window !== "undefined" ? window.innerWidth : screenWidth) || screenWidth;
      const newPoints: { x: number; y: number; size: number }[] = [];

      // Decide columns based on viewport: single-column layout for mobile
      const isMobileLocal = sw < 768;
      // On mobile show a single column, otherwise try up to 3 columns
      const desiredCols = isMobileLocal ? 1 : 3;
      const cols = Math.min(desiredCols, Math.max(1, numPoints));
      const rows = Math.ceil(numPoints / cols);

      // compute widths/heights based on computed rows/cols so grid scales with item count
      const usableWidth = Math.max(300, sw - padding * 2);
      const cellWidth = usableWidth / cols;

      // size caps
      const maxSizeDesktop = 260;
      const maxSizeMobile = 160;
      const maxAllowed = isMobileLocal ? maxSizeMobile : maxSizeDesktop;

      // compute a compact container height derived from rows so page height adapts to item count
      const gap = Math.max(12, Math.round(cellWidth * 0.06));
      const approxCell = Math.floor(Math.max(40, Math.min(cellWidth * 0.78, maxAllowed)));
      const estimatedRowsHeight = rows * (approxCell + gap + 16); // 16px extra for labels/padding
      const containerHeightUsed = Math.max(estimatedRowsHeight + padding * 2, 380);

      // Single item -> center it and make it large
      if (numPoints === 1) {
        const swCenter = sw / 2;
        const availWidth = sw - padding * 2;
        const availHeight = containerHeightUsed - padding * 2;
        const fullSize = Math.max(140, Math.min(availWidth, availHeight));
        const finalX = clamp(
          swCenter,
          padding + fullSize / 2,
          sw - padding - fullSize / 2
        );
        const finalY = clamp(
          containerHeightUsed / 2,
          padding + fullSize / 2,
          containerHeightUsed - padding - fullSize / 2
        );
        newPoints.push({ x: finalX, y: finalY, size: fullSize });
      } else {
        // distribute rows evenly through available container height (respecting padding)
        const availableHeight = Math.max(300, containerHeightUsed - padding * 2);
        const rowGap = Math.floor(availableHeight / (rows + 1));

        for (let i = 0; i < numPoints; i++) {
          const col = i % cols;
          const row = Math.floor(i / cols);

          // center of the cell (x based on columns, y spreads across rows using rowGap)
          const cx = padding + cellWidth * col + cellWidth / 2;
          const cy = padding + rowGap * (row + 1);

          // size scales with available cell space; reduce size when many items exist
          const sizeFromWidth = Math.floor(cellWidth * 0.78);
          const sizeFromHeight = Math.floor(rowGap * 0.7);
          // reduce scale slightly when many rows to avoid overlap
          const densityFactor = Math.max(0.5, 1 - (rows - 1) * 0.08);
          let size = Math.floor(Math.min(sizeFromWidth, sizeFromHeight) * densityFactor);
          size = Math.max(40, Math.min(size, maxAllowed));

          const finalX = clamp(cx, padding + size / 2, sw - padding - size / 2);
          const finalY = clamp(cy, padding + size / 2, containerHeightUsed - padding - size / 2);

          newPoints.push({ x: finalX, y: finalY, size });
        }
      }

      // also expose computed grid config so rendering can use a CSS grid
      const containerWidth = Math.min(sw - padding * 2, Math.round(cellWidth * cols + gap * (cols - 1)));

      setGridConfig({
        cols,
        rows,
        cellSize: approxCell,
        gap,
        containerWidth,
        containerHeight: containerHeightUsed,
      });
    };

    const t = setTimeout(generateGridPoints, 80);
    window.addEventListener("resize", generateGridPoints);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", generateGridPoints);
    };
  }, [menuData.length]);

  // mobile-detection removed; previously used for popup layout

  // Inject Google Fonts link for the Inspiration family (only once)
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("fonts-inspiration-preconnect")) return;

    const pre1 = document.createElement("link");
    pre1.rel = "preconnect";
    pre1.href = "https://fonts.googleapis.com";
    pre1.id = "fonts-inspiration-preconnect";
    document.head.appendChild(pre1);

    const pre2 = document.createElement("link");
    pre2.rel = "preconnect";
    pre2.href = "https://fonts.gstatic.com";
    pre2.crossOrigin = "";
    pre2.id = "fonts-inspiration-preconnect-2";
    document.head.appendChild(pre2);

    const sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.href = "https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Great+Vibes&family=Inspiration&family=Momo+Signature&family=Moon+Dance&display=swap";
    sheet.id = "fonts-inspiration-stylesheet";
    document.head.appendChild(sheet);

    return () => {
      // keep links during the session; do not remove on unmount
    };
  }, []);

  // Ensure the sticky heading sits below any site nav bar. We measure common
  // nav/header elements and offset the heading so it doesn't get hidden.
  const [headerOffset, setHeaderOffset] = useState<number>(0);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const selectors = ["nav", "header", "#nav", ".nav", ".Nav", ".navbar", ".nav-bar"];
    const measure = () => {
      let h = 0;
      for (const sel of selectors) {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (el && el.offsetHeight) {
          h = Math.max(h, el.offsetHeight);
        }
      }

      // ensure a minimum top offset of 100px across all devices so the heading
      // never sits under small navbars and is consistently positioned.
      const buffer = 8;
      const minTop = 100;
      setHeaderOffset(Math.max(h + buffer, minTop));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // No empty-cell allocation needed: show every menu item.
  const effectiveContainerHeight = gridConfig.containerHeight ?? containerHeight;

  return (
    <div
      ref={ref}
      style={{
        height: effectiveContainerHeight,
        background: "var(--wine-red)",
        position: "relative",
        overflow: "visible",
      }}
    >
     
      <svg
        width="100%"
        height={effectiveContainerHeight}
        viewBox={`0 0 ${screenWidth} ${effectiveContainerHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "sticky",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          overflow: "visible",
        }}
      >
        <motion.path
          ref={pathRef}
          d={getCurvedPath(effectiveContainerHeight)}
          stroke="white"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
      {/* Grid-aligned layout: centered container whose width depends on item count */}
      <div
        style={{
          position: "absolute",
          // start a little below the top padding and spread to bottom padding
          top: padding,
          left: "50%",
          transform: "translateX(-50%)",
          width: gridConfig.containerWidth ? gridConfig.containerWidth : "90%",
          // make the grid fill the available container height so rows distribute evenly
          height: gridConfig.containerHeight ? gridConfig.containerHeight - padding * 2 : effectiveContainerHeight - padding * 2,
          display: "grid",
          gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
          // rows should split the full height equally
          gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
          gap: `${gridConfig.gap}px`,
          justifyContent: "center",
          alignContent: "stretch",
          zIndex: 10,
          paddingBottom: 100,
        }}
      >
        {menuData.map((item, idx) => {
          // compute per-row height and choose item size so it fits comfortably in the row
          const availableHeight = effectiveContainerHeight - padding * 2 - (gridConfig.gap * (gridConfig.rows - 1));
          const rowHeight = gridConfig.rows > 0 ? Math.floor(availableHeight / gridConfig.rows) : availableHeight;
          const size = Math.min(gridConfig.cellSize || 220, Math.max(40, Math.floor(rowHeight * 0.78)));

          // Render every item (no empty cells)

          return (
              <motion.div
                  key={idx}
                  onClick={() => setSelectedItem(item)}
              style={{
                width: size,
                height: "auto",
                justifySelf: "center",
                alignSelf: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
              whileHover={{
                filter: "brightness(1.03)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              {/* image circle wrapper */}
              <div
                style={{
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#111",
                  border: "4px solid white",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
                }}
              >
                <motion.img
                  src={item.mainImage}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  whileHover={{ filter: "brightness(1.08) contrast(1.05)" }}
                  transition={{ duration: 0.25 }}
                />
              </div>

              {/* svg name under the image */}
              <div
                style={{
                  width: Math.min(size * 1.1, gridConfig.containerWidth || 9999),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <DrawTextSVG
                  path={item.namePath}
                  width={size}
                  stroke="white"
                  scale={1.2}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Popup/modal for submenu - show all images for the menu item (images only) */}
      {selectedItem && (
        <>
        <Dialog
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          maxWidth="lg"
          sx={{ zIndex: 14000 }}
          BackdropProps={{ sx: { zIndex: 13990, backgroundColor: 'rgba(0,0,0,0.45)' } }}
          PaperProps={{
            sx: {
              background: "transparent",
              boxShadow: "none",
              overflow: "visible",
              zIndex: 14001,
            },
          }}
        >
              <DialogContent sx={{ p: 2, display: 'flex', justifyContent: 'center', background: 'transparent' }}>
                <Box sx={{ position: 'relative', width: 'min(920px, 96vw)', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 6, p: 2 }}>
                  <IconButton
                    aria-label="close"
                    onClick={() => setSelectedItem(null)}
                    size="large"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                    }}
                  >
                    <span style={{ fontSize: 20, lineHeight: 1 }}>×</span>
                  </IconButton>

                  {/* Grid: show up to 6 images per page (responsive columns) */}
                  <AnimatePresence mode="wait">
                  <Box key={pageIndex} sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(3,1fr)' }, gap: 2 }}>
                    {(
                      selectedItem?.menuItems?.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize) || []
                    ).map((mi, i) => (
                      <motion.div
                        key={`${pageIndex}-${i}`}
                        layoutId={`thumb-${mi.name}-${i}`}
                        initial={{ scale: 0.3, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.3, opacity: 0, y: -20 }}
                        transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                      >
                        <Box
                          onClick={() => setFocusedItem(mi)}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            cursor: 'pointer',
                            transition: 'transform 160ms ease, box-shadow 160ms ease',
                            '&:hover': { transform: 'translateY(-6px)' },
                            '& img': { transition: 'transform 200ms ease, box-shadow 200ms ease' },
                            '&:hover img': { transform: 'scale(1.04)'},
                            '& .captionName': { transition: 'color 140ms ease' },
                            '&:hover .captionName': { color: 'primary.main' }
                          }}
                        >
                          <Box
                            component="img"
                            src={mi.image || selectedItem.mainImage}
                            alt={mi.name}
                            loading="lazy"
                            sx={{ width: '80%', height: 180, objectFit: 'cover', borderRadius: 1, justifySelf: 'center', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                          />
                          <div style={{ textAlign: 'center', marginTop: 4 }}>
                            <div className="captionName" style={{ fontWeight: 700 }}>{mi.name}</div>
                            <div style={{ color: '#666' }}>{mi.price}</div>
                          </div>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                  </AnimatePresence>

{((selectedItem?.menuItems?.length || 0) > pageSize) && (() => {
  const totalPages = Math.ceil((selectedItem?.menuItems?.length || 0) / pageSize);

  const prevPage = Math.max(0, pageIndex - 1);
  const nextPage = Math.min(totalPages - 1, pageIndex + 1);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        mt: 2,
      }}
    >
      {/* LEFT ARROW */}
      <IconButton
        aria-label="previous page"
        onClick={() => setPageIndex(prevPage)}
        disabled={pageIndex === 0}
      >
        ‹
      </IconButton>

      {/* DOTS */}
      <Box sx={{ display: "flex", gap: 1 }}>
        
        {/* PREVIOUS DOT */}
        <motion.div
          onClick={() => pageIndex > 0 && setPageIndex(prevPage)}
          animate={{
            scale: pageIndex === 0 ? 0.5 : 0.7,
            opacity: pageIndex === 0 ? 0.3 : 1,
            backgroundColor: pageIndex === 0 ? "#bdbdbd" : "#757575",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            cursor: pageIndex === 0 ? "default" : "pointer",
          }}
        />

        {/* ACTIVE DOT */}
        <motion.div
          animate={{
            scale: 1.4,
            backgroundColor: "var(--wine-red)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
          }}
        />

        {/* NEXT DOT */}
        <motion.div
          onClick={() => pageIndex < totalPages - 1 && setPageIndex(nextPage)}
          animate={{
            scale: pageIndex === totalPages - 1 ? 0.5 : 0.7,
            opacity: pageIndex === totalPages - 1 ? 0.3 : 1,
            backgroundColor: pageIndex === totalPages - 1 ? "#bdbdbd" : "#757575",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            cursor:
              pageIndex === totalPages - 1 ? "default" : "pointer",
          }}
        />

      </Box>

      {/* RIGHT ARROW */}
      <IconButton
        aria-label="next page"
        onClick={() => setPageIndex(nextPage)}
        disabled={pageIndex === totalPages - 1}
      >
        ›
      </IconButton>
    </Box>
  );
})()}

                  {/* Focused item: opening in a separate dialog (nested popup) */}
                  {/* Inline details panel removed; a nested Dialog is rendered below when focusedItem is set. */}

                  {/* Removed main image; thumbnails are shown in the grid above with pagination */}
                </Box>
              </DialogContent>
        </Dialog>

        {/* Nested details dialog for the clicked thumbnail (separate popup) */}
        <Dialog
          open={!!focusedItem}
          onClose={() => setFocusedItem(null)}
          maxWidth="sm"
          sx={{ zIndex: 15000 }}
          BackdropProps={{ sx: { zIndex: 14990, backgroundColor: 'rgba(0,0,0,0.55)' } }}
          PaperProps={{ sx: { borderRadius: 2, zIndex: 15001 } }}
        >
          <DialogContent sx={{ p: 2, position: 'relative', bgcolor: 'background.paper' }}>
            <IconButton
              aria-label="close details"
              onClick={() => setFocusedItem(null)}
              size="small"
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              ×
            </IconButton>
            <Box
              component="img"
              src={focusedItem?.image || selectedItem?.mainImage}
              alt={focusedItem?.name}
              loading="lazy"
              sx={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'cover', borderRadius: 1 }}
            />
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{focusedItem?.name}</div>
              <div style={{ color: '#666', marginTop: 4 }}>{focusedItem?.price}</div>
              <div style={{ color: '#444', marginTop: 8 }}>{focusedItem?.desc}</div>
            </Box>
          </DialogContent>
        </Dialog>
      </>
      )}
    </div>
  );
}

/* Image carousel and side-panel removed with popup */
