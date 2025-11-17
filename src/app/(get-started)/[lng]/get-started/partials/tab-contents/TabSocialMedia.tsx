import { TabsContent } from "@/components/ui/tabs"
import { motion, Variants } from "motion/react"

interface TabSocialMediaProps {
  motionVariants: Variants
}

const TabSocialMedia = ({ motionVariants }: TabSocialMediaProps) => {
  return (
    <TabsContent value="socialmedia" className="mt-10 h-96 bg-zinc-200">
      <motion.div
        key="socialmedia-content"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={motionVariants}
        className="flex h-full items-center justify-center"
      >
        <p className="text-2xl text-zinc-500">Social Media</p>
      </motion.div>
    </TabsContent>
  )
}

export default TabSocialMedia
