
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="text-center bg-white p-10 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Solar Energy Tracker</h1>
        <p className="text-xl text-gray-600 mb-6">
          Monitor your energy production and consumption in real-time
        </p>
        <Link to="/auth">
          <Button size="lg">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
