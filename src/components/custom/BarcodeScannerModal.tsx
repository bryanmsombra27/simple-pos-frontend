import { useEffect, useRef, useState, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#components/ui/dialog";
import { Barcode, XCircle } from "lucide-react";
import { Input } from "#components/ui/input";
import {
  BarcodeFormat,
  BarcodeScanner,
  type DetectedBarcode,
} from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";
import { Button } from "#components/ui/button";
const formats: BarcodeFormat[] = [
  BarcodeFormat.CODABAR,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.ITF,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
];

interface BarcodeScannerModalProps {
  setValue: any;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}
const BarcodeScannerModal: FC<BarcodeScannerModalProps> = ({
  setValue,
  opened,
  setOpened,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const scanner = (barcode: DetectedBarcode[]) => {
    if (barcode.length > 0) {
      setValue("codigo_barras", barcode[0].rawValue);
      setOpened(false);
    }
  };

  return (
    <Dialog open={opened}>
      {/* <DialogTrigger className="mr-2">
        <Barcode />
      </DialogTrigger> */}
      <DialogContent showCloseButton={false}>
        <Button
          variant="ghost"
          className="absolute top-4 right-4 bg-secondary"
          size="icon-sm"
          onClick={() => setOpened(false)}
        >
          <XCircle />
        </Button>

        <DialogHeader>
          <DialogTitle>Codigo de Barras</DialogTitle>
          <DialogDescription>
            Coloca el producto para obtener su código de barras
          </DialogDescription>
        </DialogHeader>
        <div className="h-32 ">
          <BarcodeScanner
            onCapture={scanner}
            options={{
              formats,
              delay: 100,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScannerModal;
