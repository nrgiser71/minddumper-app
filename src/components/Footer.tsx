import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-surface-light bg-surface-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <span className="text-xl font-bold text-text-primary">MindDumper</span>
            <p className="text-text-secondary text-sm">
              The fastest way to clear your head. Transform mental clutter into organized action.
            </p>
            <p className="text-text-secondary text-xs">
              A product of JBS BV
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Features</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Pricing</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Export & Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-surface-light pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <span className="text-text-secondary text-sm mb-4 md:mb-0">© 2024 JBS BV. All rights reserved.</span>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://order.minddumper.com/checkout/minddumper"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-primary text-primary-foreground hover:opacity-90 h-9 px-4"
              >
                Clear My Mind Now - €49
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;