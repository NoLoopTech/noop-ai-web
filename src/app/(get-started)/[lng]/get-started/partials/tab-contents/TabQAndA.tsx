import { TabsContent } from "@/components/ui/tabs"
import { motion, Variants } from "motion/react"

interface TabQAndAProps {
  motionVariants: Variants
}

const TabQAndA = ({ motionVariants }: TabQAndAProps) => {
  return (
    <TabsContent value="qanda" className="mt-10 h-96 bg-zinc-200">
      <motion.div
        key="qanda-content"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={motionVariants}
        className="flex h-full items-center justify-center"
      >
        <p className="text-2xl text-zinc-500">Q&A</p>
      </motion.div>
    </TabsContent>
  )
}

export default TabQAndA
