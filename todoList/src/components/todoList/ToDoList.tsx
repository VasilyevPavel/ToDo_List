import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Counter from '../counter/Counter';
import { Box } from '@mui/material';
import ControlButton from '../controlButton/ControlButton';
import './toDoListStyle.css';

interface ToDo {
  id: string;
  text: string;
  isCompleted: boolean;
}

interface IToDoListProps {
  refresh: boolean;
}

export default function ToDoList({ refresh }: IToDoListProps) {
  const [toDoList, setToDoList] = useState<ToDo[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [activeButton, setActiveButton] = useState<string>('All');

  useEffect(() => {
    const storedToDoList: ToDo[] = JSON.parse(
      localStorage.getItem('todos') || '[]'
    );
    setToDoList(storedToDoList);
  }, [refresh]);

  const handleCheckboxChange = (id: string) => {
    const updatedToDoList = [...toDoList];
    const todoIndex = updatedToDoList.findIndex((todo) => todo.id === id);

    if (todoIndex !== -1) {
      updatedToDoList[todoIndex].isCompleted =
        !updatedToDoList[todoIndex].isCompleted;
      setToDoList(updatedToDoList);
      localStorage.setItem('todos', JSON.stringify(updatedToDoList));
    }
  };

  const handleDeleteClick = (id: string) => {
    const updatedToDoList = toDoList.filter((todo) => todo.id !== id);
    setToDoList(updatedToDoList);
    localStorage.setItem('todos', JSON.stringify(updatedToDoList));
  };

  const filteredToDoList = () => {
    switch (filter) {
      case 'Active':
        return toDoList.filter((todo) => !todo.isCompleted);
      case 'Completed':
        return toDoList.filter((todo) => todo.isCompleted);
      default:
        return toDoList;
    }
  };

  const handleClearCompleted = () => {
    const updatedToDoList = toDoList.filter((todo) => !todo.isCompleted);
    setToDoList(updatedToDoList);
    localStorage.setItem('todos', JSON.stringify(updatedToDoList));
  };

  return (
    <>
      <List className="list-container">
        {filteredToDoList().length === 0 ? (
          <h1>There are no todo's</h1>
        ) : (
          filteredToDoList().map((todo: ToDo) => {
            const labelId = `checkbox-list-label-${todo.id}`;
            const textClass = todo.isCompleted
              ? 'list-item-text completed'
              : 'list-item-text';

            return (
              <ListItem key={todo.id} disablePadding>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={todo.isCompleted}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                    onChange={() => handleCheckboxChange(todo.id)}
                  />
                </ListItemIcon>
                <ListItemText
                  id={todo.id}
                  primary={todo.text}
                  className={textClass}
                />

                <IconButton
                  data-testid="toggle-btn"
                  onClick={() => handleDeleteClick(todo.id)}
                  aria-label="delete"
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItem>
            );
          })
        )}
      </List>
      <div className="bottom-block">
        <Counter length={toDoList.length} />
        <Box
          sx={{ width: '60%', display: 'flex', justifyContent: 'space-evenly' }}
        >
          <ControlButton
            title={'All'}
            setFilter={setFilter}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
          <ControlButton
            title={'Active'}
            setFilter={setFilter}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
          <ControlButton
            title={'Completed'}
            setFilter={setFilter}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
        </Box>
        <ControlButton
          title={'Clear completed'}
          handleClearCompleted={handleClearCompleted}
        />
      </div>
    </>
  );
}