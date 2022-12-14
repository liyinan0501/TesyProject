import { getAnimal, getAnimals } from 'api/animal'
import React, { useEffect, useState } from 'react'
import SingleAnimalDetailView from './SingleAnimalDetailView'
import { Button, Empty, Spin, Table } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import AnimalDrawerForm from './AnimalDrawerForm'
import { useRightsCheck } from 'utils/access'

const columns = [
  {
    title: 'Tesy nro',
    dataIndex: 'animalId',
    key: 'animalId',
  },
  {
    title: 'Laji',
    dataIndex: ['species', 'name'],
    key: 'species.name',
  },
  {
    title: 'Nimi',
    dataIndex: 'callingNameOfTheAnimal',
    key: 'callingNameOfTheAnimal',
  },
  {
    title: 'Väri',
    dataIndex: 'animalColor',
    key: 'animalColor',
  },
  {
    title: 'Mistä',
    dataIndex: 'fromWhere',
    key: 'fromWhere',
  },
]

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const Animal = (props) => {
  const [animals, setAnimals] = useState([])
  const [animal, setAnimal] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [visible, setVisible] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false);
  const hasWriteRight = useRightsCheck('Animal:Write')

  const onAnimalUpdated = (newAnimal) => {
    const newAnimalsList = animals.map(oldAnimal => {
      if (oldAnimal.animalId === newAnimal.animalId) {
        return newAnimal
      }
      return oldAnimal
    })
    setAnimals(newAnimalsList)
    setAnimal(newAnimal)
  }

  const getSingleAnimal = (id) => {
    getAnimal(id).then((res) => setAnimal(res.data))
    setVisible(true)
  }

  const fetchAndRenderAnimals = () => {
    getAnimals()
      .then((res) => {
        setAnimals(res.data)
      })
      .then(() => setFetching(false))
  }

  useEffect(() => {
    fetchAndRenderAnimals()
  }, [])

  const renderAnimals = () => {
    if (fetching) {
      return <Spin indicator={antIcon} />
    }

    return (
      <>
        <AnimalDrawerForm
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          fetchAndRenderAnimals={fetchAndRenderAnimals}
        />
        <Table
          onRow={(record) => {
            return {
              onClick: () => {
                getSingleAnimal(record.animalId)
              },
            }
          }}
          dataSource={animals}
          columns={columns}
          bordered
          title={() => (
            <>
              {hasWriteRight && <Button
                onClick={() => setShowDrawer(!showDrawer)}
                type="primary"
                shape="round"
                icon={<PlusOutlined />}
                size="small"
              >
                Lisää uusi eläin
              </Button>}
            </>
          )}
          pagination={{ pageSize: 50 }}
          scroll={{ y: 240 }}
          rowKey="animalId"
        />
      </>
    )
  }

  return (
    <>
      {visible ? (
        <SingleAnimalDetailView
          animal={animal}
          visible={visible}
          setVisible={setVisible}
          onAnimalUpdated={onAnimalUpdated}
        />
      ) : (
        renderAnimals()
      )}
    </>
  )
}

export default Animal
