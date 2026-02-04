import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CategoryDropdownProps {
  value: string;
  onChange: (category: string, subcategory?: string) => void;
  error?: string;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainCategory, setActiveMainCategory] = useState<string | null>(null);
  const [hoveredMainCategory, setHoveredMainCategory] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories: Record<string, string[]> = {
    'IT & Networking': [
      'Database Administration',
      'DevOps Engineering',
      'Information Security',
      'Network Administration',
      'Network Security',
      'Solutions Architecture',
      'System Administration'
    ],
    'Design and Creative': [
      'Graphic Design',
      'UI/UX Design',
      'Motion Graphics',
      'Brand Identity',
      'Illustration',
      'Video Editing'
    ],
    'Web Development': [
      'Frontend Development',
      'Backend Development',
      'Full Stack Development',
      'WordPress Development',
      'E-commerce Development'
    ],
    'Mobile Development': [
      'iOS Development',
      'Android Development',
      'React Native',
      'Flutter',
      'Mobile UI/UX'
    ],
    'Data Science': [
      'Data Analysis',
      'Machine Learning',
      'Data Visualization',
      'Business Intelligence',
      'Statistical Analysis'
    ],
    'Writing and Content': [
      'Content Writing',
      'Copywriting',
      'Technical Writing',
      'SEO Content',
      'Blog Writing'
    ],
    'Sales and Marketing': [
      'SEO',
      'Social Media Management',
      'Lead Generation',
      'Email Marketing',
      'Digital Marketing'
    ],
    'Legal': [
      'Corporate Law',
      'Intellectual Property',
      'Contract Review',
      'Legal Consulting'
    ]
  };

  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedMainCategory(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getFilteredCategories = () => {
    if (!searchQuery) return categories;

    const filtered: Record<string, string[]> = {};
    Object.entries(categories).forEach(([main, subs]) => {
      const filteredSubs = subs.filter(sub =>
        sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
        main.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredSubs.length > 0 || main.toLowerCase().includes(searchQuery.toLowerCase())) {
        filtered[main] = filteredSubs.length > 0 ? filteredSubs : subs;
      }
    });
    return filtered;
  };

  const handleCategorySelect = (mainCategory: string, subCategory: string) => {
    onChange(mainCategory, subCategory);
    setIsOpen(false);
    setSelectedMainCategory(null);
  };

  const displayValue = value || 'Select category';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        className={`w-full justify-between ${error ? 'border-red-500' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {displayValue}
        </span>
        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </Button>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Desktop: Side-by-side view */}
          {!mobileView && (
            <div className="flex max-h-80">
              {/* Main Categories */}
              <div className="w-1/2 border-r overflow-y-auto">
                {Object.keys(getFilteredCategories()).map((mainCat) => (
                  <div
                    key={mainCat}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-accent transition-colors ${
                      hoveredMainCategory === mainCat ? 'bg-accent' : ''
                    }`}
                    onMouseEnter={() => setHoveredMainCategory(mainCat)}
                    onClick={() => setHoveredMainCategory(mainCat)}
                  >
                    <span className="font-medium">{mainCat}</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                ))}
              </div>

              {/* Subcategories */}
              <div className="w-1/2 overflow-y-auto bg-muted/20">
                {hoveredMainCategory && (
                  <>
                    {getFilteredCategories()[hoveredMainCategory]?.map((subCat) => (
                      <div
                        key={subCat}
                        className="px-4 py-3 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleCategorySelect(hoveredMainCategory, subCat)}
                      >
                        {subCat}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Mobile: Drill-down view */}
          {mobileView && (
            <div className="max-h-80 overflow-y-auto">
              {!selectedMainCategory ? (
                // Show main categories
                <>
                  {Object.keys(getFilteredCategories()).map((mainCat) => (
                    <div
                      key={mainCat}
                      className="px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-accent transition-colors border-b last:border-b-0"
                      onClick={() => setSelectedMainCategory(mainCat)}
                    >
                      <span className="font-medium">{mainCat}</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  ))}
                </>
              ) : (
                // Show subcategories
                <>
                  <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMainCategory(null)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <span className="font-medium">{selectedMainCategory}</span>
                  </div>
                  {getFilteredCategories()[selectedMainCategory]?.map((subCat) => (
                    <div
                      key={subCat}
                      className="px-4 py-3 cursor-pointer hover:bg-accent transition-colors border-b last:border-b-0"
                      onClick={() => handleCategorySelect(selectedMainCategory, subCat)}
                    >
                      {subCat}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
