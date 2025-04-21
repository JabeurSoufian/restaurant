import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MenuItem } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, available: boolean) => void;
  isAdmin: boolean;
}

export function MenuCard({ 
  item, 
  onEdit, 
  onDelete, 
  onToggleAvailability,
  isAdmin 
}: MenuCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'appetizer':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'main':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'dessert':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'beverage':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200",
      !item.available && "opacity-60"
    )}>
      <div className="aspect-video relative bg-muted">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        <Badge 
          className={cn(
            "absolute top-2 right-2", 
            getCategoryColor(item.category)
          )}
        >
          {item.category}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <span className="font-bold">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0">
        {isAdmin ? (
          <>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={item.available} 
                onCheckedChange={(checked) => onToggleAvailability(item.id, checked)}
                id={`available-${item.id}`}
              />
              <label 
                htmlFor={`available-${item.id}`}
                className="text-sm cursor-pointer"
              >
                {item.available ? 'Available' : 'Unavailable'}
              </label>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full flex justify-between items-center">
            <Badge variant={item.available ? "default" : "outline"}>
              {item.available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}