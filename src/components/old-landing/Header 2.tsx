const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <span className="text-2xl font-bold text-text-primary">MindDumper</span>
        </div>
      </div>
    </header>
  );
};

export default Header;