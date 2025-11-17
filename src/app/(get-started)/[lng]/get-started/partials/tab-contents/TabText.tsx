import { TabsContent } from "@/components/ui/tabs"
import { motion, Variants } from "motion/react"

interface TabTextProps {
  motionVariants: Variants
}

const TabText = ({ motionVariants }: TabTextProps) => {
  return (
    <TabsContent value="text" className="mt-10 h-96 bg-zinc-200">
      <motion.div
        key="text-content"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={motionVariants}
        className="flex h-full items-center justify-center"
      >
        <p className="text-2xl text-zinc-500">Text</p>
      </motion.div>
    </TabsContent>
  )
}

export default TabText
