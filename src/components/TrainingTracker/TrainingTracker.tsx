import React, { useState } from 'react';
import './TrainingTracker.css';

interface TrainingData {
  date: string;
  kilometers: string;
}

export default function TrainingTracker() {
  const [data, setData] = useState<TrainingData[]>([
    // {
    //   date: '2021-11-11',
    //   kilometers: '11',
    // },
    // {
    //   date: '2022-11-11',
    //   kilometers: '22',
    // },
    {
      date: '2023-11-11',
      kilometers: '11.11',
    }
  ]);
  const [date, setDate] = useState<string>('');
  const [kilometers, setKilometers] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number>(-1);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (date && kilometers) {
      const newData = [...data];
      const existingData = data.find(item => item.date === date);
      
      if (existingData) {
        existingData.kilometers = (+existingData.kilometers + parseFloat(kilometers)).toString();
      } else {
        newData.push({ date, kilometers: parseFloat(kilometers).toString() });
      }

      newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setData(newData);
      setDate('');
      setKilometers('');
      setEditIndex(-1);
    }
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
      setDate(inputValue);
      return;
    }
    console.log('Ошибка формата даты', inputValue);
  }

  const handleKilometersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (/^\d{0,3}(\.\d{0,3})?$/.test(inputValue)) {
      setKilometers(inputValue);
      return;
    }
    console.log('Неправильный формат км', inputValue);
  }

  const saveEditedData = (event: React.FormEvent) => {
    event.preventDefault();

    if (editIndex >= 0) {
      const newData = [...data];

      newData[editIndex] = { date, kilometers: parseFloat(kilometers).toString() };
      newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setData(newData);
      setDate('');
      setKilometers('');
      setEditIndex(-1);
    }
  }

  const formatDate = (inputDate: string) => {
    let dateEdit = inputDate;

    if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      const dateParts = inputDate.split('-'); // Разделяем дату на части
      dateEdit = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`; // Меняем местами части даты
    }

    return dateEdit;
  }

  const  editData = (index: number) => {
    const itemToEdit = data[index];

    setDate(itemToEdit.date);
    setKilometers(itemToEdit.kilometers.toString());
    setEditIndex(index);
  }

  const deleteData = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1)
    setData(newData);
  }

  return (
    <div className="container">
      <h2>Учёт тренировок</h2>

      <div className="content">
        <form className="tracker-form" onSubmit={onSubmit}>
          <div className="tracker-data">
            <label htmlFor="date">Дата (ДД.ММ.ГГГГ)</label>
            <input
              id="date"
              type="date"
              placeholder="Дата"
              value={date}
              onChange={handleDateChange}
            />
          </div>
          <div className="tracker-kilometers">
            <label htmlFor="kilometers">Пройдено км (*.*)</label>
            <input
              id="kilometers"
              type="string"
              placeholder="Километры"
              value={(kilometers)}
              onChange={handleKilometersChange}
            />
          </div>
          
          {editIndex === -1 ? (
            <button type="submit" className="button">Добавить</button>
          ) : (
            <button onClick={saveEditedData} className="button">Ok</button>
          )}
        </form>

        <table className='tracker-table'>
          <thead>
            <tr>
              <th>Дата (ДД.ММ.ГГГГ)</th>
              <th>Пройдено км</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody className='tracker-list'>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{formatDate(item.date)}</td>
                <td>{item.kilometers}</td>
                <td>
                  <span onClick={() => editData(index)} className="tracker-button">✎</span>
                  <span onClick={() => deleteData(index)} className="tracker-button">✘</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}