import { TabsContent } from "@/components/ui/tabs"
import { motion, Variants } from "motion/react"

interface TabFilesProps {
  motionVariants: Variants
}

const TabFiles = ({ motionVariants }: TabFilesProps) => {
  return (
    <TabsContent value="files" className="mt-10 h-96 bg-zinc-200">
      <motion.div
        key="files-content"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={motionVariants}
        className="flex h-full items-center justify-center"
      >
        <p className="text-2xl text-zinc-500">Files</p>
      </motion.div>
    </TabsContent>
  )
}

export default TabFiles
