import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useLocation } from '@/context/LocationContext';
import { MapPin, Navigation, Shield } from 'lucide-react';

const LocationPermissionPrompt: React.FC = () => {
  const { showLocationPrompt, requestLocation, dismissLocationPrompt } = useLocation();

  const handleAllow = async () => {
    await requestLocation();
  };

  const handleDeny = () => {
    dismissLocationPrompt();
  };

  return (
    <AlertDialog open={showLocationPrompt} onOpenChange={() => {}}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Navigation className="w-6 h-6 text-blue-600" />
            </div>
            <AlertDialogTitle>Enable Location Access</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-3">
            <p>
              MM Hub would like to access your location to provide you with the best property search experience.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Show properties near your current location</span>
              </div>
              <div className="flex items-start gap-2">
                <Navigation className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Automatically set your search area</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Your location data is kept private and secure</span>
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Tip:</strong> You can always change or disable location sharing in your browser settings or by clicking the location icon in the search bar.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel onClick={handleDeny}>
            Not Now
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAllow} className="bg-blue-600 hover:bg-blue-700">
            Allow Location
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LocationPermissionPrompt;