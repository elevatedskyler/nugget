"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

function TestGrid() {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setSelected(selected === index ? null : index);
  };

  const items = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <motion.div
      layout
      className="mx-auto grid h-screen w-full grid-cols-4 grid-rows-2" // 4x2 grid
      transition={{ duration: 0.3 }}
    >
      {items.map((item, index) => {
        const isSelected = selected === index;
        const rowStart = Math.floor(index / 4) + 1; // Row 1 or 2
        const colStart = (index % 4) + 1; // Column 1, 2, 3, or 4

        return (
          <motion.div
            key={index}
            layout
            className={`flex cursor-pointer items-center justify-center font-sans text-xl text-white ${
              isSelected ? "bg-red-500" : "bg-cyan-500"
            }`}
            style={{
              gridRow: isSelected ? "1 / 3" : `${rowStart} / ${rowStart + 1}`,
              gridColumn: isSelected
                ? "1 / 5"
                : `${colStart} / ${colStart + 1}`,
            }}
            onClick={() => handleClick(index)}
            transition={{ duration: 0.3 }}
          >
            {item}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default TestGrid;
