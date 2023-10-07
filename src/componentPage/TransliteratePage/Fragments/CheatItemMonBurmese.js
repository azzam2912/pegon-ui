import {
    Table,
    Thead,
    Tbody, Tr,
    Th,
    Td, TableContainer
  } from "@chakra-ui/react";
  import React from "react";
  import { FaBookOpen, FaPencilAlt } from "react-icons/fa";
  
  // mempermudah buat cheatsheet (tabel transliterasi)
  export const CheatItem = ({ mon, latin, standard }) => {
    return (
      <TableContainer rounded="md" borderWidth="1px" height="56px">
        <Table variant="unstyled" size="sm" layout="fixed">
          <Thead bgColor="gray.900">
            <Tr>
              <Th>{"အက္ခရာ"}</Th>
              <Th>
                <FaPencilAlt />
              </Th>
              <Th isNumeric>
                <FaBookOpen />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{mon}</Td>
              <Td>{latin}</Td>
              <Td isNumeric>{standard}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    );
  };
  