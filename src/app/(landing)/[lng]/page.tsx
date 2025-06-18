export default function Home(): React.ReactNode {
  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center py-16 px-6 md:px-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-8 transition-colors">
          Welcome to ModelApp
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 transition-colors">
          Your comprehensive modeling solution
        </p>
      </div>
    </main>
  )
}
