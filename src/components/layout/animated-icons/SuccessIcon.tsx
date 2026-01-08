import { motion } from "motion/react"
import { JSX } from "react"

const SuccessIcon = ({ size = 96 }: { size?: number }): JSX.Element => {
  const stroke = "#10B981"

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

        <motion.path
          d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
          fill="transparent"
          stroke={stroke}
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        <motion.path
          d="M9 12l2 2l4 -4"
          fill="transparent"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.45, ease: "easeOut" }}
          style={{ originX: "50%", originY: "50%", scale: 1.4 }}
        />
      </svg>
    </div>
  )
}

export default SuccessIcon
