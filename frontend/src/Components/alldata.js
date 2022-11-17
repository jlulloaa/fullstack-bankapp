import React, {useRef} from 'react';
import { Accordion, Container } from 'react-bootstrap';
import { Navigate } from 'react-router';
// import { useCtx } from './context';
import { formatBalance, ToolTips } from './utils';
import { useDownloadExcel } from 'react-export-table-to-excel';
import { auth } from './loginbankingapp';


function AllData() {

    const user = auth.currentUser; //useCtx();
    const tableRef = useRef(null);
    const now = new Date();
    const download = (user); // TRUE => There is an account, FALSE => no account was created
    const username = download ? user.displayName : '';

    const exportData = {
        filename: username + '_' + now.toLocaleDateString('en-GB'),
        currentTableRef: tableRef.current,
        sheet: username
    };

    const { onDownload } = useDownloadExcel({ ...exportData  });

     return (
        <> { !user ? (
            <Navigate replace to='/login' />
        ) : (
            <Container>
            <Accordion defaultActiveKey="0">
            <Accordion.Item>
            <Accordion.Header>
            <div type ="button" className="btn btn-outline-primary">{download ? <>{ username },&nbsp;c</>:<>C</>}lick here to see your transactions history </div> 
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
                        <th> email </th>
                        <th align ="left"> Time </th>
                    </tr>
                </thead>
                <tbody className="table-light" data-bs-toggle="tooltip" data-bs-placement="left" title="Scroll down to see more data">
                    {user.history.map((customer, i) => (
                        <tr key={i}>
                            <td>{customer.date}</td>
                            <td>{formatBalance(customer.deposit)}</td>
                            <td>{formatBalance(customer.withdraw)}</td>
                            <td>{formatBalance(customer.balance)}</td>
                            <td>{user.at(-1).email}</td>
                            <td align ="left">{customer.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <div data-tip data-for={download ? "exportEnabledTip" : "noAccountTip" }>
                <button type="button" className="btn btn-primary" onClick={onDownload} disabled={ !download }>
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