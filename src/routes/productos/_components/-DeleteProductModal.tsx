import useDeleteProducto from "../../../hooks/productos/useDeleteProducto";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog";
import { Button } from "#components/ui/button";
import { Dialog as Dialogo } from "@base-ui/react/dialog";
interface DeleteProductModalProps<T> {
  handle: Dialogo.Handle<T>;
}

export default function DeleteProductModal<T>({
  handle,
}: DeleteProductModalProps<T>) {
  const { mutateAsync } = useDeleteProducto();

  return (
    <Dialog
      handle={handle}
      triggerId="delete-producto"
    >
      {({ payload }) => (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Está seguro de eliminar este producto? </DialogTitle>
            {payload !== undefined && (
              <DialogDescription>
                El producto{" "}
                <span className="font-bold italic">
                  {(payload as any).nombre}
                </span>
                será eliminado junto con su cantidad de almacenamiento (
                {(payload as any).stock.cantidad}
                ). ¿Desea eliminarlo?
                <div className="flex justify-between mt-5">
                  <Button
                    variant="ghost"
                    onClick={() => handle.close()}
                  >
                    Cancelar
                  </Button>

                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      handle.close();

                      setTimeout(() => {
                        mutateAsync((payload as any).id);
                      }, 500);
                    }}
                  >
                    Si, Eliminalo
                  </Button>
                </div>
              </DialogDescription>
            )}
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
}
