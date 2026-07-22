import { useState, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#components/ui/dialog";
import { Barcode, XCircle } from "lucide-react";
import { Button } from "#components/ui/button";
import BarcodeScanner, { BarcodeStringFormat } from "react-qr-barcode-scanner";
interface BarcodeScannerModalProps {
  setValue: any;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}
const formats: BarcodeStringFormat[] = [
  BarcodeStringFormat.CODABAR,
  BarcodeStringFormat.CODE_128,
  BarcodeStringFormat.CODE_39,
  BarcodeStringFormat.CODE_93,
  BarcodeStringFormat.EAN_13,
  BarcodeStringFormat.EAN_8,
  BarcodeStringFormat.ITF,
  BarcodeStringFormat.UPC_A,
  BarcodeStringFormat.UPC_E,
  BarcodeStringFormat.UPC_EAN_EXTENSION,
];

const ZxingBarcodeScannerModal: FC<BarcodeScannerModalProps> = ({
  setValue,
  opened,
  setOpened,
}) => {
  const [data, setData] = useState("Not Found");

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
        <BarcodeScanner
          width={500}
          facingMode="user"
          torch={false}
          height={500}
          formats={formats}
          onUpdate={(err, result: any) => {
            console.log("ENTRa", result);
            if (result) setData(result.text);
            else setData("Not Found");
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ZxingBarcodeScannerModal;
