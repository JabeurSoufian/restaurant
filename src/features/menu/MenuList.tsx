import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuCard } from './MenuCard';
import { MenuDialog } from './MenuDialog';
import { MenuItem } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { Plus, Search } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface MenuListProps {
  items: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  onUpdateItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleAvailability: (id: string, available: boolean) => void;
}

export function MenuList({ 
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleAvailability
}: MenuListProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (itemToDelete) {
      onDeleteItem(itemToDelete);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleDialogClose = () => {
    setEditingItem(null);
    setDialogOpen(false);
  };
  
  const handleSaveItem = (item: MenuItem) => {
    if (editingItem) {
      onUpdateItem({ ...item, id: editingItem.id });
    } else {
      onAddItem(item);
    }
    handleDialogClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isAdmin && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" value={currentCategory} onValueChange={setCurrentCategory}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="appetizer">Appetizers</TabsTrigger>
          <TabsTrigger value="main">Main Courses</TabsTrigger>
          <TabsTrigger value="dessert">Desserts</TabsTrigger>
          <TabsTrigger value="beverage">Beverages</TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentCategory} className="mt-0">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleAvailability={onToggleAvailability}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No menu items found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <MenuDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onClose={handleDialogClose}
        onSave={handleSaveItem}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this menu item. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} variant="destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}