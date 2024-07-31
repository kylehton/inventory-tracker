'use client'
import Image from "next/image";
import {useState, useEffect, useRef} from 'react'
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button} from '@mui/material'
import {collection, doc, docref, getDoc, getDocs, query, setDoc, deleteDoc } from "firebase/firestore";


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchText, setSearchText] = useState('')

  const searchTextField = (se) => setSearchText(se.target.value)

  const targetRef = useRef(null)

  const scrollToRef = () => {
    if (targetRef.current) {
      targetRef.scrollIntoView({behaviour: 'smooth', block: 'start'})
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem(itemName)
      handleClose()
    }
  }

  
  
  const updateInventory = async () => 
  {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity+1})
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity-1})
      }
    }

    await updateInventory()
  };

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  return (
    <Box 
    width="100vw" 
    height="100vh" 
    display="flex" 
    justifyContent="flex-end"
    alignItems = "center"
    flexDirection = "column"
    gap={10}
    padding={0}
    margin={0}
    >
      <Box
      width="100vw"
      height="15vh"
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      backgroundColor="#999999"
      padding={3}
      >
        <Typography fontSize={30}>Pantry Tracker v1.0</Typography>
        <Box 
        alignItems="right"
        backgroundColor="white"
        borderRadius={2}
        justifyContent="space-between"
        >

          <TextField 
            placeholder="Search for an item...."
            alignItems="right"
            backgroundColor="white"
            value={searchText}
            onChange = {(se) => {
              setSearchText(se.target.value)
            }}
            />
          
        </Box>
      </Box>


      <Modal 
      open={open}
      onClose={handleClose}
      >
        
        <Box
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor="white"
        border = "2px solid #000"
        boxShadow = {24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
          transform: 'translate(-50%,-50%)'}}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value)
            }
          }onKeyDown={handleKeyPress}
            />
            <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
            onKeyDown={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
            >Add</Button>
          </Stack>   
        </Box>
      </Modal>

      
      <Box border='1px solid #333' marginBottom={6}>
        <Box 
        width="950px" 
        height="50px" 
        bgcolor="#E7DDFF"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding={5}
        paddingLeft={7}
        paddingRight={7}

        >
          <Typography variant="h4" color="#333">Inventory Items</Typography>
          <Button variant="contained" onClick={ () => {
        handleOpen()
      }} style={{backgroundColor:"#777777"}}>Add New Item</Button>
        </Box>
      
      <Stack width="950px" height="300px" spacing={-4} overflow="auto">
        {
          inventory.map(({name, quantity}) => (
            <Box key={name} width="100%" minHeight="150px" display="flex"
             alignItems="center" justifyContent="space-between" bgColor="#f0f0f0"
            padding={7}
            >
              <Typography variant="h5" color="#333" textAlign="center" maxWidth="40%" flexGrow={1}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h5" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => {
                addItem(name)
              }}>
                Add
                </Button>
              <Button variant="contained" onClick={() => {
                removeItem(name)
              }} style={{backgroundColor:"#990F02"}}>
                Remove
                </Button>
                </Stack>
            </Box>
        ))}
      </Stack>
      </Box>
    </Box>
  
  )
}