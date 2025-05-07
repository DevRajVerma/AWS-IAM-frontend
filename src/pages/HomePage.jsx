import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <main className="flex-1">
      <div className="bg-gradient-to-b from-[#000] to-[#123] text-white text-center py-20 px-4 relative">
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">AWS Free Tier</h1>
          <p className="text-xl mb-8">Gain free, hands-on experience with AWS products and services</p>

          <Link
            to="/signup"
            className="bg-[#ff9900] text-black font-bold px-8 py-3 rounded hover:bg-[#e88a00] inline-block"
          >
            Create a Free Account
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-[#0073bb] mb-4">Get Started with AWS</h2>
            <p className="mb-4">
              Create an account to access AWS services and start building your applications in the cloud.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access to 100+ AWS services</li>
              <li>12 months free for select services</li>
              <li>Always free options available</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-[#0073bb] mb-4">Why Choose AWS</h2>
            <p className="mb-4">AWS offers reliable, scalable, and secure cloud computing services.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Global infrastructure</li>
              <li>Comprehensive security</li>
              <li>Pay only for what you use</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HomePage
