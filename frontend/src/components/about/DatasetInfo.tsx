
import { Card, CardContent } from '@/components/ui/card';

const DatasetInfo = () => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Dataset Information</h2>
      <Card className="bg-white/5 border-white/10 hover:bg-white/8 transition-all duration-300">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Household Power Consumption</h3>
              <p className="text-gray-300 mb-4">
                Real-world energy consumption data from Kaggle featuring household electricity usage patterns 
                with detailed measurements of active power, reactive power, voltage, and sub-metering data.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-gray-200">Global active/reactive power measurements</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-gray-200">Sub-metering for kitchen, laundry, and heating</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-gray-200">Temperature and time-based correlations</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-4">Dataset Features</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-green-400 font-bold">26</div>
                  <div className="text-gray-300">Sample Records</div>
                </div>
                <div>
                  <div className="text-green-400 font-bold">10</div>
                  <div className="text-gray-300">Features</div>
                </div>
                <div>
                  <div className="text-green-400 font-bold">Real-time</div>
                  <div className="text-gray-300">Processing</div>
                </div>
                <div>
                  <div className="text-green-400 font-bold">CSV</div>
                  <div className="text-gray-300">Format</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DatasetInfo;
