"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Tooltip,
  Avatar,
  Card,
  CardBody,
  Tabs,
  Tab,
  Spinner,
} from "@nextui-org/react";
import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { formatCarPrice, formatCars } from "@/utils/functions";
import { Car, CarObjectComplete } from "@/types";
import {
  ChevronDownIcon,
  EllipsisVertical,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  CarIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

type CarroRow = Database["public"]["Tables"]["carro"]["Row"];
type CarroInsert = Database["public"]["Tables"]["carro"]["Insert"];
type CarroUpdate = Database["public"]["Tables"]["carro"]["Update"];

const supabase = createClient();

const INITIAL_VISIBLE_COLUMNS = [
  "foto",
  "marca",
  "modelo",
  "versao",
  "ano_modelo",
  "preco",
  "actions",
];

const columns = [
  { name: "FOTO", uid: "foto" },
  { name: "MARCA", uid: "marca", sortable: true },
  { name: "MODELO", uid: "modelo", sortable: true },
  { name: "VERSÃO", uid: "versao", sortable: true },
  { name: "ANO MODELO", uid: "ano_modelo", sortable: true },
  { name: "PREÇO", uid: "preco", sortable: true },
  { name: "KM", uid: "km", sortable: true },
  { name: "COR", uid: "cor", sortable: true },
  { name: "AÇÕES", uid: "actions" },
];

const DashboardLayout: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "marca",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("carro").select(`
      *,
      opcionais_carro (nome),
      fotos_urls (url)
    `);
    if (error) {
      toast.error("Error fetching cars:" + error.message);
      setIsLoading(false);
      return;
    }
    const formattedCars = formatCars(data as CarObjectComplete[]) as Car[];
    setCars(formattedCars);
    setIsLoading(false);
  };

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredCars = [...cars];

    if (hasSearchFilter) {
      filteredCars = filteredCars.filter(
        (car) =>
          car.marca.toLowerCase().includes(filterValue.toLowerCase()) ||
          car.modelo.toLowerCase().includes(filterValue.toLowerCase()) ||
          car.versao.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredCars;
  }, [cars, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Car, b: Car) => {
      const first = a[sortDescriptor.column as keyof Car];
      const second = b[sortDescriptor.column as keyof Car];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  function goTo() {
    router.push("/dashboard/estoque/carpage");
  }

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Pesquisar por Marca, Modelo ou Versão"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            size="sm"
            radius="lg"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                  size="sm"
                  startContent={<FilterIcon className="text-small" />}
                >
                  Colunas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button 
              color="primary" 
              endContent={<PlusIcon />} 
              onPress={goTo}
              size="sm"
              className="ml-auto"
            >
              Adicionar Carro
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total de {filteredItems.length} de {cars.length} Carros
          </span>
          <label className="flex items-center text-default-400 text-small">
            Carros por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              onChange={onRowsPerPageChange}
              defaultValue={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    cars.length,
    filteredItems.length,
    onClear,
    goTo,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-3 px-4 flex justify-between items-center bg-default-50 border-t border-default-200 sticky bottom-0 z-10">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Todos selecionados"
            : `${selectedKeys.size} de ${filteredItems.length} selecionados`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Próximo
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]);

  const handleDelete = async (id: number) => {
    if (selectedCar?.fotos) {
      const toasts = toast.loading("Deletando fotos...", {
        progress: 0,
      });
    
      const { data: list, error: errosFotos } = await supabase.storage
        .from("carros")
        .list(`${id}`);
      const filesToRemove = list?.map((x) => `${id}/${x.name}`);
    
      if (filesToRemove && filesToRemove.length > 0) {
        const { data, error } = await supabase.storage
          .from("carros")
          .remove(filesToRemove);
        if (error) {
          toast.error("Error deleting photos:" + error.message);
          return;
        }
      }
    
      toast.update(toasts, {
        render: "Fotos deletadas",
        type: "success",
        progress: 100,
        autoClose: 2000,
      });
    }
    

    supabase
      .from("carro")
      .delete()
      .eq("id", id)
      .then((response) => {
        if (response.error) {
          toast.error("Error deleting car:" + response.error.message);
          return;
        }
        setCars(cars.filter((car) => car.id !== id));
        toast.success("Carro deletado com sucesso");
        setIsDeleteModalOpen(false);
      });
  };

  const handleEdit = (car: Car) => {
    router.push(`/dashboard/estoque/carpage?id=${car.id}`);
  };

  const handleInputChange = (
    key: keyof CarroUpdate,
    value: string | number | boolean
  ) => {
    if (selectedCar) {
      setSelectedCar({ ...selectedCar, [key]: value });
    }
  };

  const handleRowAction = (key: React.Key) => {
    const car = cars.find((car) => car.id === key);
    if (car) {
      handleEdit(car);
    }
  };
  

  const handleSave = () => {
    if (selectedCar) {
      supabase
        .from("carro")
        .update(selectedCar)
        .eq("id", selectedCar.id)
        .then((response) => {
          if (response.error) {
            toast.error("Error updating car:" + response.error.message);
            return;
          }
          setCars(
            cars.map((car) => (car.id === selectedCar.id ? selectedCar : car))
          );
          toast.success("Car updated successfully");
          setIsEditModalOpen(false);
        });
    }
  };

  const renderCell = useCallback((car: Car, columnKey: React.Key) => {
    const cellValue = car[columnKey as keyof Car];

    switch (columnKey) {
      case "foto":
        return (
          <Avatar
            src={car.fotos && car.fotos.length > 0 ? car.fotos[0] : undefined}
            fallback={<CarIcon className="w-7 h-7" />}
            radius="sm"
            size="sm"
            className="cursor-pointer"
            onClick={() => {
              setSelectedCar(car);
              setIsViewModalOpen(true);
            }}
          />
        );
      case "preco":
        return (
          <p>
            {formatCarPrice(cellValue as number)}
          </p>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Tooltip content="Visualizar detalhes">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                onPress={() => {
                  setSelectedCar(car);
                  setIsViewModalOpen(true);
                }}
              >
                <EyeIcon className="text-default-400 w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Editar carro">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                onPress={() => handleEdit(car)}
              >
                <EditIcon className="text-blue-500 w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Excluir carro">
              <Button 
                isIconOnly 
                size="sm" 
                variant="light" 
                onPress={() => {
                  setSelectedCar(car);
                  setIsDeleteModalOpen(true);
                }}
              >
                <TrashIcon className="text-danger w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="p-4 md:p-8 flex flex-col h-[calc(100vh)] overflow-hidden">
      <Card shadow="none" className="mb-4">
        <CardBody>
          <h1 className="text-2xl font-bold mb-2">Estoque de Veículos</h1>
          <p className="text-default-500 text-sm">
            Gerencie todos os veículos disponíveis no estoque
          </p>
        </CardBody>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Spinner size="lg" color="primary" label="Carregando veículos..." />
        </div>
      ) : (
        <Card shadow="none" radius="sm" className=" flex-1  flex flex-col overflow-hidden">
          <CardBody className="p-0 flex flex-col h-full overflow-hidden">
            <Table
              aria-label="Tabela de veículos em estoque"
              radius="none"
              isHeaderSticky
              bottomContent={bottomContent}
              bottomContentPlacement="outside"
              classNames={{
                wrapper: "flex-1 overflow-auto shadow-none",
                th: " text-default-600",
                tr: "hover:bg-default-50 transition-colors cursor-pointer",
                base: "h-full flex flex-col",
                table: "flex-1",
              }}
              selectedKeys={selectedKeys}
              selectionMode="single"
              sortDescriptor={sortDescriptor}
              topContent={topContent}
              topContentPlacement="inside"
              onSelectionChange={setSelectedKeys}
              onSortChange={setSortDescriptor}
              onRowAction={handleRowAction}
            >
              <TableHeader columns={headerColumns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                    allowsSorting={column.sortable}
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody 
                emptyContent={"Nenhum veículo encontrado"} 
                items={sortedItems}
                loadingContent={<Spinner color="primary" />}
              >
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}

      {/* Modal de Visualização */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedCar && (
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold">
                      {selectedCar.marca} {selectedCar.modelo}
                    </h3>
                    <p className="text-default-500 text-sm">{selectedCar.versao}</p>
                  </div>
                )}
              </ModalHeader>
              <ModalBody>
                {selectedCar && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      {selectedCar.fotos && selectedCar.fotos.length > 0 ? (
                        <img 
                          src={selectedCar.fotos[0]} 
                          alt={`${selectedCar.marca} ${selectedCar.modelo}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-default-100 flex items-center justify-center rounded-lg">
                          <CarIcon size={64} className="text-default-300" />
                        </div>
                      )}
                      <div className="flex gap-2 overflow-x-auto py-2">
                        {selectedCar.fotos && selectedCar.fotos.slice(1).map((foto, index) => (
                          <img 
                            key={index} 
                            src={foto} 
                            alt={`${selectedCar.marca} ${selectedCar.modelo} - ${index + 2}`}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-default-500">Marca</p>
                          <p className="font-medium">{selectedCar.marca}</p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Modelo</p>
                          <p className="font-medium">{selectedCar.modelo}</p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Versão</p>
                          <p className="font-medium">{selectedCar.versao}</p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Ano Modelo</p>
                          <p className="font-medium">{selectedCar.ano_modelo}</p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Preço</p>
                          <p className="font-medium text-success-600">{formatCarPrice(selectedCar.preco)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Quilometragem</p>
                          <p className="font-medium">{selectedCar.km ? `${selectedCar.km} km` : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Cor</p>
                          <p className="font-medium">{selectedCar.cor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Carroceria</p>
                          <p className="font-medium">{selectedCar.carroceria}</p>
                        </div>
                      </div>
                      {selectedCar.opcionais && selectedCar.opcionais.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-default-500 mb-1">Opcionais</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedCar.opcionais.map((opcional, index) => (
                              <Chip key={index} size="sm" variant="flat" className="capitalize">
                                {opcional}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Fechar
                </Button>
                <Button color="primary" onPress={() => selectedCar && handleEdit(selectedCar)}>
                  Editar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de Edição - Mantido para compatibilidade, mas agora redirecionamos para a página de edição */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Editar Carro</ModalHeader>
          <ModalBody>
            {selectedCar && (
              <>
                <Input
                  label="Marca"
                  value={selectedCar.marca}
                  onChange={(e) => handleInputChange("marca", e.target.value)}
                />
                <Input
                  label="Modelo"
                  value={selectedCar.modelo}
                  onChange={(e) => handleInputChange("modelo", e.target.value)}
                />
                <Input
                  label="Versão"
                  value={selectedCar.versao}
                  onChange={(e) => handleInputChange("versao", e.target.value)}
                />
                <Input
                  label="Ano Modelo"
                  type="number"
                  value={selectedCar.ano_modelo.toString()}
                  onChange={(e) =>
                    handleInputChange("ano_modelo", parseInt(e.target.value))
                  }
                />
                <Input
                  label="Preço"
                  type="number"
                  value={selectedCar.preco.toString()}
                  onChange={(e) =>
                    handleInputChange("preco", parseInt(e.target.value))
                  }
                />
                <Input
                  label="Cor"
                  value={selectedCar.cor}
                  onChange={(e) => handleInputChange("cor", e.target.value)}
                />
                <Input
                  label="Carroceria"
                  value={selectedCar.carroceria}
                  onChange={(e) =>
                    handleInputChange("carroceria", e.target.value)
                  }
                />
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleSave}>
              Salvar
            </Button>
            <Button color="danger" onPress={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader className="text-danger">Confirmar Exclusão</ModalHeader>
          <ModalBody>
            {selectedCar && (
              <div className="text-center">
                <TrashIcon className="w-12 h-12 text-danger mx-auto mb-4" />
                <p className="mb-2">
                  Você tem certeza que deseja remover este veículo?
                </p>
                <p className="font-bold text-lg">
                  {selectedCar.marca} {selectedCar.modelo} {selectedCar.versao}
                </p>
                <p className="text-sm text-default-500 mt-1">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={() => selectedCar && handleDelete(selectedCar.id)}
            >
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DashboardLayout;
