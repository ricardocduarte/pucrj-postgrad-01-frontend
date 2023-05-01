import React, { useCallback, useMemo, useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
const BASE_URL = "http://127.0.0.1:5000"  //url do servidor de API




const Tabela = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  
    const GetllData=()=>{
        axios.get(BASE_URL + "/hotels")
        .then(res => {
            setTableData(res.data.message);          
        })
    }
    const PostData=({name, stars, price,city})=>{        
        axios.post(BASE_URL + "/hotel",{name, stars, price,city})
            .then((res) => {
                tableData.push(res.data.message)
                setTableData([...tableData])                    
            })    
    }
    const PutData=({id,name, stars, price,city})=>{        
        axios.put(BASE_URL + "/hotel/"+id,{name, stars, price,city})
            .then((res) => {
                //GetllData()                  
            })    
    }
    const RemoveData=(id)=>{        
        axios.delete(BASE_URL + "/hotel/"+id)                
    }
    useEffect(() => {    
        GetllData()
    },[]);
  
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      
      PutData(values)
      let hoteis = [...tableData]
      let hotel = {...hoteis[row.index]}
      hotel = values
      hoteis[row.index] = hotel
      setTableData(hoteis)
      exitEditingMode(); 
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
        let res = window.confirm(`Realmente deseja excluir o hotel # ${row.getValue('id')} - ${row.getValue('name')} ?`)
       if (!res) {
         return;
       }
       RemoveData(row.getValue('id'))
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData],
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],       
      };
    },
    [validationErrors],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: '#',
        enableColumnOrdering: false,
        enableEditing: false, 
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Nome',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'stars',
        header: 'Avaliação',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'price',
        header: 'Valor',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'currency',          
        }),
      },
      {
        accessorKey: 'city',
        header: 'Cidade',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        }),
      },      
    ],
    [getCommonEditTextFieldProps],
  );

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: '',
            muiTableHeadCellProps: {
              align: 'center',
            },
            
          },
        }}
        localization={MRT_Localization_PT_BR}
        positionActionsColumn="last"
        columns={columns}
        data={tableData}
        editingMode="modal"
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Editar">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Excluir">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="primary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            + Novo Hotel
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        postData={PostData}
      />
    </>
  );
};

export const CreateNewAccountModal = ({ open, columns, onClose, postData }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    //cadastra o hotel e atualiza a tabela
    postData(values)    
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Inclusão de Novo Hotel</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
                (column.accessorKey !== 'id')?
                <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />:''

              
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Cadastrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Tabela;
