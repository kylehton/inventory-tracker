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
  const [searchResults, setSearchResults] = useState([])

  const searchTextField = (se) => setSearchText(se.target.value)

  const targetRef = useRef(null)

  const scrollToRef = () => {
    if (targetRef.current) {
      targetRef.scrollIntoView({behaviour: 'smooth', block: 'start'})
    }
  }

  const handleSearch = (e) => {
    const searchKeyWord = e.target.value.toLowerCase()
    setSearchText(searchKeyWord)
    const filteredKeyWord = inventory.filter(item => item.name.toLowerCase().includes(searchKeyWord))
    setSearchResults(filteredKeyWord)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem(itemName)
      setItemName('')
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
    setSearchResults(inventoryList)
  }


  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
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
    justifyContent="flex-start"
    alignItems = "center"
    flexDirection = "column"
    gap={3}
    padding={0}
    margin={0}
    backgroundColor="#777777"
    >
      <Box
      width="100vw"
      height="15vh"
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      padding={2}
      paddingLeft={5}
      paddingRight={5}
      >
        <Typography fontSize={30} color="white">Pantry Tracker v1.0</Typography>
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
            onChange={handleSearch}
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
        sx={{ transform: 'translate(-50%,-50%)',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px' }}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        
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

      
      <Box 
      borderRadius={5}
      overflow="hidden"
      style={{
      marginBottom: '0px',
      paddingBottom: '0px',
      backgroundColor: 'rgba(255, 255, 255, 0.5)'
      }}
      >
        <Box 
        borderTopLeftRadius={5}
        borderTopRightRadius={5}
        width="950px" 
        height="50px" 
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="#999"
        padding={5}
        paddingLeft={6}
        paddingRight={6}

        >
          <Typography variant="h4" color="#444444">Inventory Items</Typography>
          <Button variant="contained" onClick={ () => {
        handleOpen()
      }} style={{backgroundColor:"#777777"}}>Add New Item</Button>
        </Box>
      
      <Stack width="950px" height="350px" spacing={-6} overflow="auto">
        {
          searchResults.map(({name, quantity}) => (
            <Box key={name} width="100%" minHeight="130px" display="flex"
             alignItems="center" justifyContent="space-between" bgColor="#f0f0f0"
            padding={6}
            paddingTop={3}
            paddingBottom={4}

            >
              <Typography variant="h5" color="#444" textAlign="left" maxWidth="40%" flexGrow={1}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h5" color="#444" textAlign="center">
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