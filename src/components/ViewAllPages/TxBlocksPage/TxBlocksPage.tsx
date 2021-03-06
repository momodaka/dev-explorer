import React, { useState, useRef, useCallback, useMemo, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

import ViewAllTable from 'src/components/ViewAllPages/ViewAllTable/ViewAllTable'
import { NetworkContext } from 'src/services/networkProvider'
import { timestampToTimeago, qaToZil, pubKeyToZilAddr } from 'src/utils/Utils'
import { TxBlockObj } from '@zilliqa-js/core/src/types'

import './TxBlocksPage.css'
import { MappedTxBlockListing } from 'src/typings/api'

// Pre-processing data to display
const processMap = new Map()
processMap.set('age-col', timestampToTimeago)
processMap.set('reward-col', (amt: number) => (
  <OverlayTrigger placement='top'
    overlay={<Tooltip id={'tt'}> {qaToZil(amt)} </Tooltip>}>
    <span>{qaToZil(amt)}</span>
  </OverlayTrigger>
))
processMap.set('miner-col', pubKeyToZilAddr)
processMap.set('height-col', (height: number) => (<Link to={`txbk/${height}`}>{height}</Link>))
processMap.set('hash-col', (hash: number) => ('0x' + hash))

const TxBlocksPage: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const columns = useMemo(
    () => [{
      id: 'height-col',
      Header: 'Height',
      accessor: 'header.BlockNum',
    },
    {
      id: 'numTxns-col',
      Header: 'Transactions',
      accessor: 'header.NumTxns',
    },
    {
      id: 'reward-col',
      Header: 'Reward',
      accessor: 'header.Rewards',
    },
    {
      id: 'miner-col',
      Header: 'Miner',
      accessor: 'header.MinerPubKey',
    },
    {
      id: 'age-col',
      Header: 'Age',
      accessor: 'header.Timestamp',
    },
    {
      id: 'hash-col',
      Header: 'Hash',
      accessor: 'body.BlockHash',
    }], []
  )

  const fetchIdRef = useRef(0)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [data, setData] = useState<TxBlockObj[] | null>(null)

  const fetchData = useCallback(({ pageIndex }) => {
    if (!dataService) return

    const fetchId = ++fetchIdRef.current
    let receivedData: MappedTxBlockListing
    const getData = async () => {
      try {
        setIsLoading(true)
        receivedData = await dataService.getTxBlocksListing(pageIndex + 1)

        if (receivedData) {
          setData(receivedData.data)
          setPageCount(receivedData.maxPages)
          setIsLoading(false)
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (fetchId === fetchIdRef.current)
      getData()

  }, [dataService])

  return (
    <>
      {<div>
        <h2 className='txblockpage-header'>Transaction Blocks</h2>
        <ViewAllTable
          columns={columns}
          data={data ? data : []}
          isLoading={isLoading}
          processMap={processMap}
          fetchData={fetchData}
          pageCount={pageCount}
        />
      </div>}
    </>
  )
}

export default TxBlocksPage
