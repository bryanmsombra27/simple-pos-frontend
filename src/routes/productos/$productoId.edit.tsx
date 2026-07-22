import { Button } from "#components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Barcode, EditIcon, FileTextIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldGroup, FieldLabel } from "#components/ui/field";
import { Input } from "#components/ui/input";
import { Textarea } from "#components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#components/ui/breadcrumb";
import { FileUploader } from "react-drag-drop-files";
import { useEffect, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "#components/ui/input-group";
import BarcodeScannerModal from "#components/custom/BarcodeScannerModal";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProductAction } from "../../actions/productos/productos";
import useUpdateProduct from "../../hooks/productos/useUpdateProduct";

const zodSchema = z.object({
  precio: z.coerce.number().positive(),
  nombre: z.string(),
  codigo_barras: z.string(),
  descripcion: z.string().optional(),
  almacen: z.coerce.number().positive(),
});
type FormValues = z.input<typeof zodSchema>;
type FormData = z.output<typeof zodSchema>;
const fileTypes = ["JPEG", "PNG", "GIF"];

const productoQueryOptions = (productoId: string) => {
  const productoQuery = queryOptions({
    queryKey: ["producto", productoId],
    queryFn: () => getProductAction(productoId),
  });
  return productoQuery;
};

export const Route = createFileRoute("/productos/$productoId/edit")({
  loader: ({ params, context }) => {
    const productoQuery = productoQueryOptions(params.productoId);

    return context.queryClient.ensureQueryData(productoQuery);
  },
  component: Productos,
});

function Productos() {
  const { productoId } = Route.useParams();
  const productoQuery = productoQueryOptions(productoId);
  const { data: producto } = useSuspenseQuery(productoQuery);
  //   const { producto } = data;
  const { mutateAsync } = useUpdateProduct();
  const [file, setFile] = useState<File | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { reset, handleSubmit, register, setValue } = useForm<
    FormValues,
    undefined,
    FormData
  >({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      nombre: producto.nombre,
      almacen: producto.stock.cantidad,
      descripcion: producto.descripcion ?? "",
      codigo_barras: producto.codigo_barras,
      precio: producto.precio,
    },
  });

  useEffect(() => {
    if (!producto) return;
    reset({
      nombre: producto.nombre,
      precio: producto.precio,
      almacen: producto.stock.cantidad,
      descripcion: producto.descripcion ?? "",
      codigo_barras: producto.codigo_barras,
    });
  }, [producto, reset]);

  const submit = async (form: FormData) => {
    try {
      await mutateAsync({ id: productoId, producto: form });

      // setTimeout(() => {
      // }, 1000);
    } catch (error) {
      reset();
    } finally {
    }
  };

  const handleChange = (file: any) => {
    console.log(file, "ARCHIVO SUBIDO");
    setFile(file);
  };
  return (
    <>
      <div className="container px-10 py-5">
        <div className="flex justify-between items-center mb-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link to="/productos">Productos</Link>}
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar Producto</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button
            type="button"
            onClick={() => handleSubmit(submit)()}
          >
            <EditIcon />
            Guardar Cambios
          </Button>
        </div>

        {/* <h1 className="text-2xl font-bold my-10"> Nuevo Producto</h1> */}
        <div className="flex gap-10">
          <form className=" p-5 rounded-2xl shadow-lg  grow ">
            <h3 className="text-lg font-semibold my-5">
              Información del Producto
            </h3>
            <div className="grid grid-cols-2 gap-10 col-span-2">
              <FieldGroup className="m-2">
                <Field>
                  <FieldLabel htmlFor="nombre">Nombre del Producto</FieldLabel>
                  <Input
                    id="nombre"
                    type="text"
                    {...register("nombre", { required: true })}
                  />
                </Field>
              </FieldGroup>
              <FieldGroup className="m-2">
                <Field>
                  <FieldLabel htmlFor="precio">Precio</FieldLabel>
                  <Input
                    id="precio"
                    type="number"
                    {...register("precio", { required: true })}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup className="m-2">
                <Field>
                  <FieldLabel htmlFor="codigo_barras">
                    Código de Barras
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="codigo_barras"
                      placeholder="Ingresa o Escanea código de barras..."
                      {...register("codigo_barras", { required: true })}
                    />
                    <InputGroupAddon
                      align="inline-end"
                      className="p-2 mr-5"
                    >
                      <Barcode
                        onClick={() => setIsOpenModal((state) => !state)}
                        className="cursor-pointer"
                      />
                      <BarcodeScannerModal
                        setValue={setValue}
                        opened={isOpenModal}
                        setOpened={setIsOpenModal}
                      />
                      {/* <ZxingBarcodeScannerModal
                        setValue={setValue}
                        opened={isOpenModal}
                        setOpened={setIsOpenModal}
                      /> */}
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>
              <FieldGroup className="m-2">
                <Field>
                  <FieldLabel htmlFor="almacen">Para Almacén</FieldLabel>
                  <Input
                    id="almacen"
                    type="number"
                    min={1}
                    {...register("almacen", { required: true })}
                  />
                </Field>
              </FieldGroup>

              <FieldGroup className="m-2 col-span-2">
                <Field>
                  <FieldLabel htmlFor="descripcion">Descripción</FieldLabel>
                  <Textarea
                    id="descripcion"
                    {...register("descripcion")}
                  />
                </Field>
              </FieldGroup>
            </div>
          </form>

          <div className=" p-5 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold my-5">Imagen del Producto</h3>
            <div className="">
              <FileUploader
                classes="file-upload"
                handleChange={handleChange}
                name="file"
                types={fileTypes}
              />
            </div>

            {/* <p>{file ? `File name: ${file[0].name}` : "no files uploaded yet"}</p> */}
          </div>
        </div>
      </div>
    </>
  );
}
