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
export const CheatItem = ({ pegon, latin, standard }) => {
  return (
    <TableContainer rounded="md" borderWidth="1px" height="56px">
      <Table variant="unstyled" size="sm" layout="fixed">
        <Thead bgColor="gray.900">
          <Tr>
            <Th>{"\u0623\u0628\u062C"}</Th>
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
            <Td>{pegon}</Td>
            <Td>{latin}</Td>
            <Td isNumeric>{standard}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};
