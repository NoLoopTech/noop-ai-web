import { motion } from "motion/react"
import { JSX } from "react"

const PartialSuccessIcon = ({ size = 96 }: { size?: number }): JSX.Element => {
  const stroke = "#10B981"

  const paths = [
    "M14 3.223a9.003 9.003 0 0 1 0 17.554",

    "M10 20.777a8.942 8.942 0 0 1 -2.48 -.969",
    "M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592",
    "M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305",
    "M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356"
  ]

  return (
    <div className="mx-auto mb-4" style={{ width: size, height: size }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* invisible background path - keep for viewBox consistency */}
        <path d="M0 0h24v24H0z" fill="none" stroke="none" />

        {paths.map((d, i) => {
          const delay = i === 0 ? 0 : 0.18 + (i - 1) * 0.1
          return (
            <motion.path
              key={i}
              d={d}
              fill="transparent"
              stroke={stroke}
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.28,
                delay,
                ease: "easeInOut"
              }}
              style={{ originX: "50%", originY: "50%" }}
            />
          )
        })}

        {/* check mark - draw after segments */}
        <motion.path
          d="M9 12l2 2l4 -4"
          fill="transparent"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.5, ease: "easeOut" }}
          style={{ originX: "50%", originY: "50%", scale: 1.4 }}
        />
      </svg>
    </div>
  )
}

export default PartialSuccessIcon
