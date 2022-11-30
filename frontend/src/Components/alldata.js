import React, {useRef, useState, useEffect} from 'react';
import { Accordion, Container } from 'react-bootstrap';
import { Navigate } from 'react-router';
import { formatBalance, formatDate, ToolTips } from '../utils/tools';
import { useDownloadExcel } from 'react-export-table-to-excel';
import { auth } from '../utils/fir-login';
import { useAuthState } from 'react-firebase-hooks/auth';
import {getAllBankingData} from '../utils/middleware';
import { LoadingPage, Header } from '../utils/tools';

function AllData() {

    const tableRef = useRef(null);
    const [entries, setEntries] = useState();
    const [fetching, setFetching] = useState(false);

    const [user] = useAuthState(auth);

    const now = new Date();
    const exportData = {
        filename: '',
        currentTableRef: '',
        sheet: ''
    };
    let username = ''

    if (user) {
        username = user.name ? user.name : user.displayName;
        exportData.filename = username + '_' + now.toLocaleDateString('en-GB');
        exportData.currentTableRef = tableRef.current;
        exportData.sheet = username;
    }

    const { onDownload } = useDownloadExcel({ ...exportData  });
 
    useEffect(() => {
        const fetchEntries = async () => {
            setFetching(true);
            const fetchedEntries = await getAllBankingData(user);
            setEntries(fetchedEntries);
        }
        fetchEntries();
        setFetching(false);
      }, [user]);

      if (entries === undefined) {
        setEntries(null);
      }

    function camelise(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

      const transactionDescription = function({transactionType, transferFrom, transferTo, account_nro}) {
        const transactName = camelise(transactionType);
            if (transactName === 'Transferin') {
                return <> Transfer from {transferFrom}</>
            } else if (transactName === 'Transferout') {
                return <> Transfer to {transferTo} </>
            } else if (transactName === 'Setup') {
                return <> Setup Bank Account - Account Nro: {account_nro}</>
            } else {
                return <> {camelise(transactName)} </>
            }
      }

      return (
        <> { !user ? (
            <Navigate replace to='/login' />
        ) : ( 
            <Container> { fetching ? <LoadingPage /> : <></>}
            <Accordion defaultActiveKey="0">
            <Accordion.Item>
            <Accordion.Header>
            <div type ="button" className="btn btn-outline-primary">{user ? <>{ username },&nbsp;c</>:<>C</>}lick here to see your transactions history </div> 
            </Accordion.Header>
            <Accordion.Body>
            <div className="table-responsive table-wrapper-scroll-y my-custom-scrollbar">
            <table ref={tableRef} className="table table-hover table-bordered">
                <thead className="table-info align-middle" data-bs-toggle="tooltip" data-bs-placement="left" title="Scroll left to see more information">
                    <tr>
                        <th> Date <br/><span style={{fontSize: '0.75em'}}>dd/mm/yy (hh:mm:ss)</span></th>
                        <th> Paid In </th>
                        <th> Paid Out </th>
                        <th> Balance </th>
                        <th> Transaction Details </th>
                    </tr>
                </thead>
                <tbody className="table-light" data-bs-toggle="tooltip" data-bs-placement="left" title="Scroll down to see more data">
                    {entries ? (entries.map((entry, i) => (
                        <tr key={i}>
                            <td>{formatDate(entry.timestamp).date} ({formatDate(entry.timestamp).time})</td>
                            <td>{formatBalance(entry.transaction_type==='deposit' | entry.transaction_type==='transferin' ? entry.transaction_amount:0)}</td>
                            <td>{formatBalance(entry.transaction_type==='withdrawal' | entry.transaction_type ==='transferout' ? entry.transaction_amount:0)}</td>
                            <td>{formatBalance(entry.balance)}</td>
                            <td>{transactionDescription({transactionType: entry.transaction_type.toLowerCase(), transferFrom: entry.transfer_from, transferTo: entry.transfer_to, account_nro: entry.account_nro})}</td>
                        </tr>
                    ))):(<></>)}
                </tbody>
            </table>
            </div>
            <div data-tip data-for={user ? "exportEnabledTip" : "noAccountTip" }>
                <button type="button" className="btn btn-primary" onClick={onDownload} disabled={ !user }>
                    Export to  excel 
                </button>
            </div>
            </Accordion.Body>
            </Accordion.Item>
            </Accordion>
            <Header/>
            <ToolTips></ToolTips>
            </Container>
        )}
        </>
        );
}

export default AllData;