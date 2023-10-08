import {
  OrderedList,
  UnorderedList,
  Heading,
  ListItem,
  Divider,
  Text,
} from "@chakra-ui/react";

const headingMargin = 3;

const sizes = ["xl", "lg", "md", "sm", "sm", "sm"];

const headingDefault =
  (level) =>
  ({ children }) => (
    <>
      <Heading as={`h${level}`} size={sizes[`${level - 1}`]} my={headingMargin}>
        {children}
      </Heading>
      <Divider my={headingMargin} />
    </>
  );

export const customDefaults = {
  strong: ({ children }) => {
    return <Text as="b">{children}</Text>;
  },
  code: ({ children }) => {
    return <Text as="kbd">{children}</Text>;
  },

  h1: headingDefault(1),
  h2: headingDefault(2),
  h3: headingDefault(3),
  h4: headingDefault(4),
  h5: headingDefault(5),
  h6: headingDefault(6),

  ul: ({ children }) => {
    return <UnorderedList as="ul">{children}</UnorderedList>;
  },
  li: ({ children }) => {
    return <ListItem as="li">{children}</ListItem>;
  },
  ol: ({ children }) => {
    return <OrderedList as="ol">{children}</OrderedList>;
  },
};
