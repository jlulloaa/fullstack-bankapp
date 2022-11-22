import React, {useRef, useState, useEffect} from 'react';
import { Accordion, Container } from 'react-bootstrap';
import { Navigate } from 'react-router';
// import { useCtx } from './context';
import { formatBalance, ToolTips } from './utils';
import { useDownloadExcel } from 'react-export-table-to-excel';
import { auth } from './fir-login';
import { useAuthState } from 'react-firebase-hooks/auth';
import {getAllBankingData} from '../services/middleware';
import { LoadingPage } from './utils';

function AllData() {

    const tableRef = useRef(null);
    const [entries, setEntries] = useState();
    const [fetching, setFetching] = useState(false);

    const [user] = useAuthState(auth);

    // const fetchEntries = async (user) => {
    //     console.log(`Sending user ${JSON.stringify(user)} to backend`);
    //     const fetchedEntries = await getAllBankingData(user);
    //     return fetchedEntries;
    // }
    const now = new Date();
    const exportData = {
        filename: '',
        currentTableRef: '',
        sheet: ''
    };
    let username = ''
    // const retrieveData = async () => {
    //     const output = await getAllBankingData(user);
    //     console.log(`Output: ${output}`);
    //     setEntries(output); //fetchEntries(user);
    //     setFetching(false);
    // }

    // if (user) {
    //     console.log(`Going to fetch data from user: ${JSON.stringify(user)}`);
    //     setFetching(true);
    //     retrieveData();
    // // }

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
                        <th> Date <br/><span style={{fontSize: '0.75em'}}>(DD/MM/YY)</span></th>
                        <th> Paid In </th>
                        <th> Paid Out </th>
                        <th> Balance </th>
                        <th> Type of Transaction </th>
                        <th align ="left"> Time </th>
                    </tr>
                </thead>
                <tbody className="table-light" data-bs-toggle="tooltip" data-bs-placement="left" title="Scroll down to see more data">
                    {entries ? (entries.map((entry, i) => (
                        <tr key={i}>
                            <td>{entry.timestamp}</td>
                            <td>{formatBalance(entry.transaction_type==='deposit' | entry.transaction_type==='transferin' ? entry.transaction_amount:0)}</td>
                            <td>{formatBalance(entry.transaction_type==='withdrawal' | entry.transaction_type ==='transferout' ? entry.transaction_amount:0)}</td>
                            <td>{formatBalance(entry.balance)}</td>
                            <td>{entry.transaction_type.toUpperCase()}</td>
                            <td align ="left">{entry.timestamp}</td>
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
            <ToolTips></ToolTips>
            </Container>
        )}
        </>
        );
}

export default AllData;