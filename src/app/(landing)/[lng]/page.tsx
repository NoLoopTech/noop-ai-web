export default function Home(): React.ReactNode {
  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center bg-white px-6 py-16 transition-colors duration-300 md:px-24 dark:bg-black">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="mb-8 text-4xl font-bold text-black transition-colors md:text-6xl dark:text-white">
          Welcome to ModelApp
        </h1>
        <p className="text-xl text-gray-700 transition-colors dark:text-gray-300">
          Your comprehensive modeling solution
        </p>
      </div>
    </main>
  )
}
