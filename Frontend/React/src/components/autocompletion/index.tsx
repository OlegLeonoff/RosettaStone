import React, { useState, useEffect, useRef, SyntheticEvent, ChangeEvent } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, CircularProgress, makeStyles } from '@material-ui/core';
  

interface INameAndId {
  id: string,
  name: string
}

interface IProps {
  getItems: (text: string) => Promise<INameAndId[]> | undefined,
  setSelectedItem: (item: INameAndId) => void
}

const Autocompletion = (props: IProps) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState<INameAndId[]>([]);
  const [skipNextOpen, setSkipNextOpen] = useState(false);
  
  const inputRef = useRef<HTMLInputElement | undefined>();

  useEffect(() => {
    const handleWindowFocus = () => {
      setSkipNextOpen(inputRef.current === document.activeElement);
    };
    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
  }, []);

  
  const handleOpen = () => {
    if (skipNextOpen) {
      setSkipNextOpen(false);
      return;
    }
    setOpen(true);
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    setLoading(true);
    try {
      if(text) {
        const items = await props.getItems(text);
        if(items) {
          setFilteredItems(items);
        }
      }
      else {
        setFilteredItems([]);
      }
    }
    catch(error) {
      throw error;
    }
    finally {
      setLoading(false);
    }
  }

  const handleSelectionChange = (event: ChangeEvent<{}>, option: INameAndId | null): void => {
    if(option) {   
        setSelectedItem(option);
        props.setSelectedItem(option);
    }
  }

  return (
    <Autocomplete
        id="recipient"
        options={filteredItems}
        getOptionLabel={option => option.name}                   
        style={{ width: 300 }}
        open={open}
        onOpen={handleOpen}
        onClose={() => setOpen(false)}
        onChange={handleSelectionChange}
        renderInput={params => (
          <TextField 
            inputRef={inputRef}
            {...params} 
            label="Recipient"
            variant="outlined"
            placeholder="Start typing"
            onChange={handleInputChange} 
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>)}}
          />
        )}
      />
  )
 }

 export default Autocompletion;