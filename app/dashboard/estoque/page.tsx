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
} from "lucide-react";
import { useRouter } from "next/navigation";

type CarroRow = Database["public"]["Tables"]["carro"]["Row"];
type CarroInsert = Database["public"]["Tables"]["carro"]["Insert"];
type CarroUpdate = Database["public"]["Tables"]["carro"]["Update"];

const supabase = createClient();

const statusColorMap: Record<string, ChipProps["color"]> = {
  novo: "success",
  usado: "warning",
  seminovo: "primary",
};

const INITIAL_VISIBLE_COLUMNS = [
  "marca",
  "modelo",
  "versao",
  "ano_modelo",
  "preco",
  "actions",
];

const columns = [
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
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "marca",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const { data, error } = await supabase.from("carro").select(`
      *,
      opcionais_carro (nome),
      fotos_urls (url)
    `);
    if (error) {
      toast.error("Error fetching cars:" + error.message);
      return;
    }
    const formattedCars = formatCars(data as CarObjectComplete[]) as Car[];
    setCars(formattedCars);
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
          car.modelo.toLowerCase().includes(filterValue.toLowerCase())
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
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Pesquisar por Marca ou Modelo"
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
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
            <Button color="primary" endContent={<PlusIcon />} onPress={goTo}>
              Adicionar novo Carro
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total de {cars.length} Carros
          </span>
          <label className="flex items-center text-default-400 text-small">
            Número de carros por pagina:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
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
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
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
  }, [selectedKeys, filteredItems.length, page, pages, hasSearchFilter]);

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
      case "preco":
        return formatCarPrice(cellValue as number);
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <EllipsisVertical className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem color="primary" onPress={() => handleEdit(car)}>
                  Editar
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    setSelectedCar(car);
                    setIsDeleteModalOpen(true);
                  }}
                  color="danger"
                >
                  Deletar
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[600px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
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
        <TableBody emptyContent={"No cars found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

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

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Confirmar Delete</ModalHeader>
          <ModalBody>
            {selectedCar && (
              <p>
                Você tem certeza que deseja remover: {selectedCar.marca}{" "}
                {selectedCar.modelo}?
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() => selectedCar && handleDelete(selectedCar.id)}
            >
              Deletar
            </Button>
            <Button color="primary" onPress={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DashboardLayout;
