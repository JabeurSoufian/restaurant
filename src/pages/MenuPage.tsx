import React, { useState, useEffect } from 'react';
import { MenuList } from '@/features/menu/MenuList';
import { MenuItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function MenuPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated data fetching - would be replaced with Supabase queries
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockItems: MenuItem[] = [
          {
            id: '1',
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 12.99,
            category: 'main',
            image_url: 'https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            available: true,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: '2',
            name: 'Caesar Salad',
            description: 'Romaine lettuce, croutons, parmesan cheese, and Caesar dressing',
            price: 8.99,
            category: 'appetizer',
            image_url: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            available: true,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: '3',
            name: 'Tiramisu',
            description: 'Italian dessert made of ladyfingers dipped in coffee, layered with mascarpone cheese',
            price: 7.99,
            category: 'dessert',
            image_url: 'https://images.pexels.com/photos/13295052/pexels-photo-13295052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            available: true,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: '4',
            name: 'Red Wine',
            description: 'House red wine, 175ml glass',
            price: 6.50,
            category: 'beverage',
            available: true,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: '5',
            name: 'Chicken Alfredo',
            description: 'Fettuccine pasta tossed with chicken and creamy Alfredo sauce',
            price: 15.99,
            category: 'main',
            image_url: 'https://images.pexels.com/photos/5949888/pexels-photo-5949888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            available: false,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: '6',
            name: 'Garlic Bread',
            description: 'Toasted bread with garlic butter and herbs',
            price: 4.99,
            category: 'appetizer',
            image_url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            available: true,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          },
        ];
        
        setItems(mockItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load menu items',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);

  const handleAddItem = (item: MenuItem) => {
    setItems((prevItems) => [...prevItems, item]);
    toast({
      title: 'Success',
      description: 'Menu item added successfully',
    });
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    toast({
      title: 'Success',
      description: 'Menu item updated successfully',
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast({
      title: 'Success',
      description: 'Menu item deleted successfully',
    });
  };

  const handleToggleAvailability = (id: string, available: boolean) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, available } : item
      )
    );
    toast({
      title: 'Status Updated',
      description: `Item marked as ${available ? 'available' : 'unavailable'}`,
    });
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-muted rounded w-1/4 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-40 bg-muted rounded"></div>
                <div className="h-5 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Menu</h1>
        <p className="text-muted-foreground">
          Manage your restaurant's menu items
        </p>
      </div>
      
      <MenuList
        items={items}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onToggleAvailability={handleToggleAvailability}
      />
    </div>
  );
}