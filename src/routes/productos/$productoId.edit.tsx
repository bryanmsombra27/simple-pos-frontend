import { Button } from "#components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Barcode, EditIcon, XIcon } from "lucide-react";
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
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "#components/ui/attachment";
import ValidationMessage from "#components/custom/ValidationMessage";

const zodSchema = z.object({
  precio: z.coerce
    .number("El precio es requerido")
    .positive("Debe ser un número mayor a 0"),
  nombre: z.string().nonempty("El campo es requerido"),
  codigo_barras: z.string().nonempty("El campo es requerido"),
  descripcion: z.string().optional(),
  almacen: z.coerce
    .number("La cantidad para guardar en almacen es requerida")
    .positive("Debe de ser un número mayor a 0"),
  file: z.file().optional(),
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

  const {
    reset,
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues, undefined, FormData>({
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
    const formData = new FormData();

    for (const [key, value] of Object.entries(form)) {
      if (key == "file") {
        const file = getValues("file") as File;
        if (file) {
          formData.append("file", file, file.name);
        }
      } else {
        formData.append(key, value.toString());
      }
    }

    try {
      await mutateAsync({ id: productoId, producto: formData });
    } catch (error) {
      reset();
    } finally {
    }
  };

  const handleChange = (file: any) => {
    if (file) {
      setValue("file", file);
    }
    setFile(file);
  };

  return (
    <>
      <div className="container px-10 py-5">
        <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row  justify-between items-center mb-10">
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
        <div className="flex flex-col md:flex-row  gap-10">
          <form className=" p-5 rounded-2xl shadow-lg grow ">
            <h3 className="text-lg font-semibold my-5 mx-5">
              Información del Producto
            </h3>
            <div className="md:grid md:grid-cols-2 gap-5 p-5 md:gap-10 md:p-10  ">
              <FieldGroup className="m-2">
                <Field>
                  <FieldLabel htmlFor="nombre">Nombre del Producto</FieldLabel>
                  <Input
                    id="nombre"
                    type="text"
                    {...register("nombre", { required: true })}
                  />
                  {errors.nombre && (
                    <ValidationMessage message={errors.nombre.message!} />
                  )}
                </Field>
              </FieldGroup>
              <FieldGroup className="m-2 block ">
                <Field>
                  <FieldLabel htmlFor="precio">Precio</FieldLabel>
                  <Input
                    id="precio"
                    type="number"
                    {...register("precio", { required: true })}
                  />

                  {errors.precio && (
                    <ValidationMessage message={errors.precio.message!} />
                  )}
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

                  {errors.codigo_barras && (
                    <ValidationMessage
                      message={errors.codigo_barras.message!}
                    />
                  )}
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
                  {errors.almacen && (
                    <ValidationMessage message={errors.almacen.message!} />
                  )}
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
                types={fileTypes}
                {...register("file")}
              />
            </div>
            {(file || producto) && (
              <Attachment
                orientation="vertical"
                className="w-auto md:w-70 mx-auto mt-5"
              >
                <AttachmentMedia variant="image">
                  <img
                    src={file ? URL.createObjectURL(file) : producto.imagen}
                    alt={file?.name}
                    className="object-cover bg-center"
                  />
                </AttachmentMedia>
                {file && (
                  <AttachmentContent>
                    <AttachmentTitle>{file?.name}</AttachmentTitle>
                    <AttachmentDescription>
                      {file.type} · {file.size / 1024} MB
                    </AttachmentDescription>
                  </AttachmentContent>
                )}
                <AttachmentActions>
                  <AttachmentAction
                    aria-label="Remove sales-dashboard.pdf"
                    onClick={() => {
                      setValue("file", undefined);
                      setFile(null);
                    }}
                  >
                    <XIcon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            )}
            {/* <p>{file ? `File name: ${file[0].name}` : "no files uploaded yet"}</p> */}
          </div>
        </div>
      </div>
    </>
  );
}
