import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-surface-light bg-surface-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <span className="text-xl font-bold text-text-primary">MindDumper</span>
            <p className="text-text-secondary text-sm">
              The fastest way to clear your head. Transform mental clutter into organized action.
            </p>
            <p className="text-text-secondary text-xs">
              A product of JBS BV
            </p>
          </div>
          
          <div className="text-right">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Terms of Service</a></li>
              <li><span className="text-text-secondary text-sm">Support: </span><a href="mailto:support@minddumper.com" className="text-text-secondary hover:text-text-primary text-sm transition-colors">support@minddumper.com</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-surface-light pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <span className="text-text-secondary text-sm mb-4 md:mb-0">© {new Date().getFullYear()} JBS BV. All rights reserved.</span>
            
            <div className="flex items-center space-x-4">
              <a href="https://order.minddumper.com/checkout/minddumper" className="inline-flex">
                <Button variant="hero" size="sm">
                  Clear My Mind Now - €49
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;