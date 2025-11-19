import { TabsContent } from "@/components/ui/tabs"
import { motion, Variants } from "motion/react"

interface TabFilesProps {
  motionVariants: Variants
}

const TabFiles = ({ motionVariants }: TabFilesProps) => {
  return (
    <TabsContent value="files" className="mt-4 h-96 rounded-md bg-zinc-200">
      <motion.div
        key="files-content"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={motionVariants}
        className="flex h-full flex-col items-center justify-center"
      >
        <p className="text-2xl font-bold text-zinc-500">Files</p>
        <p className="text-base text-zinc-500">(Coming Soon)</p>
      </motion.div>
    </TabsContent>
  )
}

export default TabFiles
